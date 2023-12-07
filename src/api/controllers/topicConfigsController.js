const topicConfigService = require('../../services/topicConfigService');

exports.getAll = async (ctx) => {
    ctx.body = await topicConfigService.getTopicIds();
};

exports.getById = async (ctx) => {
    ctx.body = await topicConfigService.getTopicNameById(ctx.params.id);
};