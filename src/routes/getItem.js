const db = require('../persistence');

module.exports = async (req, res) => {
    const items = await db.getItem(req.params.id, req.params.TableName);
    res.send(items);
};
