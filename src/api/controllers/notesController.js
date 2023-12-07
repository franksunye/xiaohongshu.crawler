const notesService = require('../../services/csvService');
const storageService = require('../../services/storageService');

exports.getAll = async (ctx) => {
    ctx.body = await storageService.loadData(notesService.noteLogCsvFilePath);
};

exports.getById = async (ctx) => {
    ctx.body = await notesService.getById(ctx.params.id);
};

exports.create = async (ctx) => {
    ctx.body = "Create operation not supported";
};

exports.update = async (ctx) => {
    ctx.body = "Update operation not supported";
};

exports.delete = async (ctx) => {
    ctx.body = "Delete operation not supported";
};