const topicStatsService = require('../../services/topicStatsService');

exports.getById = async (ctx) => {
    ctx.body = await topicStatsService.readTopicsFile(ctx.params.id);
};

exports.update = async (ctx) => {
    await topicStatsService.updateTopicsFile(ctx.params.id, ctx.request.body.duration, ctx.request.body.newRecordsCount);
    ctx.status = 204;
};