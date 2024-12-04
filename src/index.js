const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const getItem = require('./routes/getItem')
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/items/:TableName', getItems);
app.get('items/:TableName/:id', getItem)
app.post('/items/:TableName', addItem);
app.put('/items/:TableName/:id', updateItem);
app.delete('/items/:TableName/:id', deleteItem);

db.init().then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
