const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((acc, rej) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.serialize(()=>{
                            db.run('CREATE TABLE IF NOT EXISTS Gamers (id varchar(36), name varchar(255), mmrank int(80), pw varchar(255), wins int(80), loses int(80))', (err, result) => { if (err) return rej(err); acc();});
                            db.run('CREATE TABLE IF NOT EXISTS Matches (id varchar(36), players varchar(255), winner varchar(36), gameType varchar(36), location varchar(36))', (err, result) => { if (err) return rej(err); acc();});
                            db.run('CREATE TABLE IF NOT EXISTS Games (id varchar(36), name varchar(255), description varchar(255))', (err, result) => { if (err) return rej(err); acc();});
                            db.run('CREATE TABLE IF NOT EXISTS Locations (id varchar(36), name varchar(255), description varchar(255))', (err, result) => { if (err) return rej(err); acc();});
                            db.run('CREATE TABLE IF NOT EXISTS Admins (id varchar(36), name varchar(255), pw varchar(255), secGroup varchar(36))', (err, result) => { if (err) return rej(err); acc();});
                            db.run('CREATE TABLE IF NOT EXISTS SecurityGroups (id varchar(36), name varchar(255), description varchar(255), permissions varchar(255))', (err, result) => { if (err) return rej(err); acc();});         
                            db.run('CREATE TABLE IF NOT EXISTS AvailWindow (id varchar(36), name varchar(255), description varchar(255))', (err, result) => { if (err) return rej(err); acc();});
                        });
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems(table) {
    return new Promise((acc, rej) => {
        db.all(`SELECT * FROM ${table}`, (err, rows) => {
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
        db.all('SELECT * FROM ? WHERE id=?', [table, id], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                )[0],
            );
        });
    });
}

async function storeItem(item, table) {
    return new Promise((acc, rej) => {
        db.run(
            `INSERT INTO ${table} (id, name) VALUES (?, ?)`,
            item.id, item.name,
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        db.run(
            'UPDATE ? SET name=? WHERE id = ?',
            [item.table, item.name, item.completed ? 1 : 0, id],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
} 

async function removeItem(id, table) {
    return new Promise((acc, rej) => {
        db.run('DELETE FROM ? WHERE id = ?', [table, id], err => {
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
