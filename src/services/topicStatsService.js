const storageService = require('./storageService');
const config = require('../config');

exports.updateStats = async (topicId, duration, newRecordsCount) => {
    const topics = await storageService.loadData(config.topicsCsvFilePath);
    const topic = topics.find(topic => topic.id === topicId);
    if (topic) {
        topic.duration += duration;
        topic.newRecordsCount += newRecordsCount;
        await storageService.saveData(config.topicsCsvFilePath, topics, Object.keys(topics[0]));
    }
};

exports.getStats = async (topicId) => {
    const topics = await storageService.loadData(config.topicsCsvFilePath);
    return topics.find(topic => topic.id === topicId);
};