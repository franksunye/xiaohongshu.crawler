const db = require('../db');

exports.getAll = async () => {
    return db.get('topics').value();
};

exports.getById = async (id) => {
    return db.get('topics').find({ id }).value();
};

exports.create = async (topic) => {
    return db.get('topics').push(topic).write();
};

exports.update = async (id, topic) => {
    return db.get('topics').find({ id }).assign(topic).write();
};

exports.delete = async (id) => {
    return db.get('topics').remove({ id }).write();
};