const mysql = require('mysql2');
const config = require('config');
const util = require('util');

const { host, user, password, database, port } = config.get('mysql');

class MySql {
    constructor() {
        this.pool = mysql.createPool({
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
        
        this.pool.query = util.promisify(this.pool.query);
        this.pool.execute = util.promisify(this.pool.execute);
    }
}

const connectMysql = () => {
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

    return pool;
}


const pool = connectMysql();

const middleware = (req, res, next) => {
    req.db = pool;
    return next();
};

module.exports = {
    connectMysql,
    db: pool,
    middleware,
};