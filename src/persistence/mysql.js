const waitPort = require('wait-port');
const fs = require('fs');
const mysql = require('mysql2');

const {
    MYSQL_HOST: HOST,
    MYSQL_HOST_FILE: HOST_FILE,
    MYSQL_USER: USER,
    MYSQL_USER_FILE: USER_FILE,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_PASSWORD_FILE: PASSWORD_FILE,
    MYSQL_DB: DB,
    MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool;

async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST;
    const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER;
    const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE) : PASSWORD;
    const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB;

    await waitPort({
        host,
        port: 3306,
        timeout: 10000,
        waitForDns: true,
    });

    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
        charset: 'utf8mb4',
    });

    return new Promise((acc, rej) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS Gamers (id varchar(36), name varchar(255), mmrank int(80), pw varchar(255), wins int(80), loses int(80)) DEFAULT CHARSET utf8mb4',
            'CREATE TABLE IF NOT EXISTS Pairing (id varchar(36), players varchar(255), winner varchar(36), gameType varchar(36), location varchar(36)) DEFAULT CHARSET utf8mb4',
            'CREATE TABLE IF NOT EXISTS Games (id varchar(36), name varchar(255), description varchar(255)) DEFAULT CHARSET utf8mb4',
            'CREATE TABLE IF NOT EXISTS Locations (id varchar(36), name varchar(255), description varchar(255)) DEFAULT CHARSET utf8mb4',
            'CREATE TABLE IF NOT EXISTS Admins (id varchar(36), name varchar(255), pw varchar(255), secGroup varchar(36)) DEFAULT CHARSET utf8mb4',
            'CREATE TABLE IF NOT EXISTS SecurityGroups (id varchar(36), name varchar(255), description varchar(255), permissions varchar(255)) DEFAULT CHARSET utf8mb4',
            'CREATE TABLE IF NOT EXISTS AvailWindow (id varchar(36), name varchar(255), description varchar(255)) DEFAULT CHARSET utf8mb4',
            err => {
                if (err) return rej(err);

                console.log(`Connected to mysql db at host ${HOST}`);
                acc();
            },
        );
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        pool.end(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems(table) {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM ?', [table], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item),
                ),
            );
        });
    });
}

async function getItem(id, table) {
    return new Promise((acc, rej) => {
        pool.query(`SELECT * FROM ${table} WHERE id='${id}'`, (err, rows) => {
            if (err) return rej(err);
            acc(item);
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        pool.query(
            'INSERT INTO ? (id, name) VALUES (?, ?)',
            [item.table, item.id, item.name],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        pool.query(
            'UPDATE ? SET name=? WHERE id=?',
            [item.table, item.name, id],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function removeItem(id, table) {
    return new Promise((acc, rej) => {
        pool.query(`DELETE FROM ${table} WHERE id=${id}`, err => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
