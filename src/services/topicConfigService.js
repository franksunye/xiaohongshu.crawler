const storageService = require('./storageService');
const config = require('../config');

exports.getTopicIds = async () => {
    const topics = await storageService.loadData(config.topicsCsvFilePath);
    return topics.map(topic => topic.id);
};

exports.getTopicNameById = async (id) => {
    const topics = await storageService.loadData(config.topicsCsvFilePath);
    const topic = topics.find(topic => topic.id === id);
    return topic ? topic.name : null;
};