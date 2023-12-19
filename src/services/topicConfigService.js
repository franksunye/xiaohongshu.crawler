const storageService = require('./storageService');
const config = require('../config');
const logger = require('../utils/logger');

exports.getAllConfigs = async () => {
    logger.info('[TopicConfigService] getAllConfigs: Start');
    const topics = await storageService.loadData(config.topicsCsvFilePath);
    logger.debug(`[TopicConfigService] getAllConfigs: End, topics = ${JSON.stringify(topics)}`);
    return topics;
};

exports.getTopicIds = async () => {
    logger.info('[TopicConfigService] getTopicIds: Start');
    const topics = await storageService.loadData(config.topicsCsvFilePath);
    const topicIds = topics.map(topic => topic['话题ID']);
    logger.debug(`[TopicConfigService] getTopicIds: End, topics = ${JSON.stringify(topics)}`);
    return topicIds;
};

exports.getTopicNameById = async (id) => {
    logger.info(`[TopicConfigService] getTopicNameById: Start, id = ${id}`);
    const topics = await storageService.loadData(config.topicsCsvFilePath);
    const topic = topics.find(topic => topic['话题ID'] === id);
    logger.debug(`[TopicConfigService] getTopicNameById: End, topic = ${JSON.stringify(topic)}`);
    return topic ? topic['话题名称'] : null;
};