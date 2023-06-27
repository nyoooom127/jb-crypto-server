const mysql = require('mysql2');
const config = require('config');
const util = require('util');

const { host, user, password, database, port } = config.get('mysql');


const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    connectionLimit: 10,
    waitForConnections: true,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
});


pool.query = util.promisify(pool.query);
pool.execute = util.promisify(pool.execute);

const middleware = (req, res, next) => {
    req.db = pool;
    return next();
};

module.exports = {
    db: pool,
    middleware,
};