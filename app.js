const express = require('express');
const config = require('config');
const auth = require('./middlewares/auth');
const path = require('path');
const app = express();
const port = config.get('app.port');
const host = config.get('app.host');

const guestRouter = require('./routes/guestRouter');
const userRouter = require('./routes/userRouter');
const githubRouter = require('./routes/githubRouter');
const notFound = require('./middlewares/404');
const errorHandler = require('./middlewares/error');

app.use(auth.initialize());
// app.use(auth.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use('/', guestRouter);
app.use('/', userRouter);
app.use('/github', githubRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(port, host, () => {
    console.log(`Running in environment: '${process.env.NODE_ENV}'`);
    console.log(`Crypto server listening on port ${config.get('app.port')}`);
});
