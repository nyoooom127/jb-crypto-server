const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const path = require('path');
const app = express();
const port = config.get('app.port');
const host = config.get('app.host');
const { host: mongoHost, port: mongoPort, db: mongoDb } = config.get('mongo');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cookieParser());
app.use(session({
    // store: sessionStore,
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
    },
}));

const guestRouter = require('./routes/guestRouter');
const userRouter = require('./routes/userRouter');
const githubRouter = require('./routes/githubRouter');
const notFound = require('./middlewares/404');
const errorHandler = require('./middlewares/error');

app.use(auth.initialize());
app.use(auth.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use('/', guestRouter);
app.use('/', userRouter);
app.use('/github', githubRouter);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message from worker', (message) => {
        console.log('io: message from worker', message);
        io.emit('update from express', message);
    });
});

app.use(notFound);

app.use(errorHandler);

server.listen(port, host, () => {
    try {
        console.log(`Running in environment: '${process.env.NODE_ENV}'`);
        (async () => {
            await mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDb}`);
            console.log('Connected To mongo db');
        })();
        console.log(`Crypto server listening on port ${port}`);
    } catch (err) {
        console.log('Failed to connect to db...');
        process.exit(1);
    }
});

module.exports = app;
