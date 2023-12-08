// app.js

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const fs = require('fs');

const { startCrawling } = require('./services/crawlerService');
const TopicConfigService = require('./services/topicConfigService');
const { sendNotification, sendFile } = require('./services/wechatService');

const config = require('./config');
const logger = require('./utils/logger');

function parseCommandLineArgs() {
    const args = yargs(hideBin(process.argv)).option('topicId', {
        alias: 't',
        describe: 'The topic ID to crawl',
        type: 'string'
    }).option('sortType', {
        alias: 's',
        describe: 'The sort type of the crawl (hot or new)',
        type: 'string',
        default: 'new'
    }).argv;
    logger.info(`[app] parseCommandLineArgs: Parsed command line args: ${JSON.stringify(args)}`);
    return args;
}

async function crawlSingleTopic(topicId, sortType) {
    logger.info(`[app] crawlSingleTopic: Starting crawl for topicId: ${topicId} with sortType: ${sortType}`);
    const { duration, newRecordsCount, requestCount } = await startCrawling(topicId, sortType);
    await sendNotification(topicId, duration, newRecordsCount, requestCount);
    logger.info(`[app] crawlSingleTopic: Notification sent for topicId: ${topicId}`);
}

async function crawlAllTopics(sortType) {
    logger.info(`[app] crawlAllTopics: Starting crawl for all Topic IDs in topics.csv with sortType: ${sortType}`);
    const topicIds = await TopicConfigService.getTopicIds();
    for (const topicId of topicIds) {
        logger.info(`[app] crawlAllTopics: Crawling topicId: ${topicId}`);
        await crawlSingleTopic(topicId, sortType);
        logger.info(`[app] crawlAllTopics: Notification sent for topicId: ${topicId}`);
    }
    await sendFile(config.noteLogCsvFilePath, '小红薯笔记');
    await sendFile(config.topicLogCsvFilePath, '小红薯话题');
}

async function main() {
    const { topicId, sortType } = parseCommandLineArgs();

    if (topicId) {
        logger.info(`[app] main: Crawl initiated for single topic with topicId: ${topicId}, sortType: ${sortType}`);
        await crawlSingleTopic(topicId, sortType);
    } else {
        logger.info(`[app] main: Crawl initiated for all topics with sortType: ${sortType}`);
        await crawlAllTopics(sortType);
    }

    logger.info('[app] main: Crawl completed.');
}

main();
