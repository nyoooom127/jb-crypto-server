const config = require('config');
const mysql = require('mysql2');
const util = require('util');

const { host, user, password, database } = config.get('mysql');

const connection = mysql.createConnection({
    host,
    user,
    password,
    database,
});

connection.connect = util.promisify(connection.connect);
connection.query = util.promisify(connection.query);


(async () => {
    try {
        await connection.connect();
        console.log("Connected!");

        console.log(`Initializing '${database}' tables:`);

        await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id int auto_increment,
            github_id varchar(255) not null,
            primary key (id)
        )
        `);
        console.log('initialized users table');

        await connection.query(`
        CREATE TABLE IF NOT EXISTS users_symbols (
            id int auto_increment,
            user_id int not null,
            symbol varchar(5) not null,
            primary key (id)
            )
        `);
        console.log('initialized users table');

        console.log(`Finished initializing '${database}' tables!`);

    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();