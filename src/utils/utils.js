// utils.js

const logger = require('../utils/logger');

function formatDuration(duration) {
    logger.info(`[utils] formatDuration: Formatting duration: ${duration}`);
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    if (hours === 0) {
        return `${minutes}分${seconds}秒`;
    }

    return `${hours}小时${minutes}分${seconds}秒`;
}

function getRandomInterval(interval) {
    const minInterval = interval * 0.1; // 10% of the interval
    const maxInterval = interval * 1.5; // 150% of the interval
    const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1) + minInterval);
    logger.debug(`[utils] getRandomInterval: Generated random interval: ${randomInterval}`);
    return randomInterval;
}

module.exports = { formatDuration, getRandomInterval };