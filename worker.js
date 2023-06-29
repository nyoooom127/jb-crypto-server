const config = require('config');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const { connectMysql } = require('./middlewares/mysql');
const SymbolValue = require('./models/mongo/symbolValue');
const UserSymbol = require('./models/mysql/userSymbol');

const { host: mongoHost, port: mongoPort, db: mongoDb } = config.get('mongo');
const { interval } = config.get('worker');

const db = connectMysql();

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

        // const symbolValue = await SymbolValue.findOneAndUpdate({ symbol: symbol }, { value: Number(value), createdAt: new Date() }, {
        //     new: true,
        //     upsert: true // Make this update into an upsert
        // });

        await symbolValue.save();

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