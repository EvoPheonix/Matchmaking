const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateItem(req.params.id, {
        name: req.body.name,
        table: req.params.TableName
    });

    const item = await db.getItem(req.params.id, req.params.TableName);
    res.send(item);
};
