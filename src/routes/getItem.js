const db = require('../persistence');

module.exports = async (req, res) => {
    const item = await db.getItem(req.params.id, req.params.TableName);
    res.send(item);
};
