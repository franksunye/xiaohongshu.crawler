const storageService = require('./storageService');
const config = require('../config');
const logger = require('../utils/logger');

exports.updateTopicStatus = async (topicId, duration, newRecordsCount) => {
    const updateFn = (record) => {
        if (record['话题ID'] === topicId) {
            record['累计爬取时间'] = Number(record['累计爬取时间']) + duration;
            record['累计爬取次数'] = Number(record['累计爬取次数']) + 1;
            record['已保存话题数量'] = Number(record['已保存话题数量']) + newRecordsCount;
        }
        return record;
    };
    const fieldNames = ['话题ID', '话题名称', '累计爬取时间', '累计爬取次数', '话题实际数量', '已保存话题数量', '话题登记时间', '最近一次爬取时间'];
    await storageService.updateRecordInCsv(config.topicsCsvFilePath, updateFn, fieldNames);
    logger.info(`[topicService] updateTopicStatus: Updated topic successfully for topicId: ${topicId}`);
};

exports.getTopicStats = async (topicId) => {
    const topics = await storageService.loadData(config.topicsCsvFilePath);
    return topics.find(topic => topic['话题ID'] == topicId);
};