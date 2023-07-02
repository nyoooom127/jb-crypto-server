const config = require('config');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const { io } = require('socket.io-client');
const { db } = require('./middlewares/mysql');
const SymbolValue = require('./models/mongo/symbolValue');
const UserSymbol = require('./models/mysql/userSymbol');

const { host: mongoHost, port: mongoPort, db: mongoDb } = config.get('mongo');
const { interval, app: { host: appHost, port: appPort } } = config.get('worker');

const socket = io(`http://${appHost}:${appPort}`);

const scrape = async (symbol) => {
    try {
        const html = await axios(`https://www.google.com/finance/quote/${symbol}-USD`);
        const $ = cheerio.load(html.data);
        const value = $('.YMlKec.fxKbKc').text().replace(',', '');

        const symbolValue = new SymbolValue({
            symbol: symbol,
            value: Number(value),
            createdAt: new Date()
        });

        await symbolValue.save();

        await socket.emit('message from worker', {
            symbol: symbolValue.symbol,
            value: symbolValue.value,
        });

        console.log(`Saved value: ${symbolValue.value} for symbol ${symbolValue.symbol}`);

        return symbolValue;
    } catch (err) {
        console.log(err);
    }
};

const loop = async () => {
    const userSymbol = new UserSymbol(db);
    const symbols = await userSymbol.findDistinct();
    console.log(`scraping: ${symbols.map(({ symbol }) => symbol)}`);

    const promises = symbols.map(({ symbol }) => scrape(symbol));
    await Promise.allSettled(promises);

    setTimeout(loop, interval);
};

(async () => {
    await mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDb}`);

    loop();
})();