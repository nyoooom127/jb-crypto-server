const express = require('express');
const app = express();
const port = 3000;
const host = 'localhost';

const guestRouter = require('./routes/guestRouter');
const userRouter = require('./routes/userRouter');
const githubRouter = require('./routes/githubRouter');
const notFound = require('./middlewares/404');
const errorHandler = require('./middlewares/error');

app.use('/', guestRouter);
app.use('/', userRouter);
app.use('/github', githubRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(port, host, () => {
    console.log(`Crypto server listening on port ${port}`);
});
