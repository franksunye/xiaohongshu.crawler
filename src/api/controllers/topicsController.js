const topicsService = require('../../services/topicsFileService');
const storageService = require('../../services/storageService');

exports.getAll = async (ctx) => {
    ctx.body = await storageService.loadData(topicsService.topicsCsvFilePath);
};

exports.getById = async (ctx) => {
    ctx.body = await topicsService.getTopicNameById(ctx.params.id);
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