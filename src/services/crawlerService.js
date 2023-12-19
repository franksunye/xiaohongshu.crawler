// crawlerService.js

const cheerio = require('cheerio');
const axios = require('axios');

const storageService = require('./storageService'); // 替换 csvService 和 topicsFileService
const TopicLogsService = require('./topicLogsService');
const TopicConfigService = require('./topicConfigService');
const NoteLogsService = require('./noteLogsService');

const logger = require('../utils/logger');
const { getRandomInterval } = require('../utils/utils');
const config = require('../config');


async function startCrawling(topicId, sortType) {

    const startTime = Date.now();
    let newRecordsCount = 0;

    // 获取爬取前的记录数
    const initialRecordCount = await NoteLogsService.countLogs(); // 更新 countCsvRecords 调用

    let cursor = '';
    let hasMore = true;
    let requestCount = 0;

    // 获取话题名称
    const topicName = await TopicConfigService.getTopicNameById(topicId);
    let totalNotesCount; // 在这里声明变量

    while (hasMore && requestCount < config.maxRequests) {

        logger.info(`[crawlerService] startCrawling: Starting request number: ${requestCount + 1} for topicId: ${topicId} with sortType: ${sortType}`);

        const data = await fetchData(topicId, cursor, sortType);
        if (data && data.data && data.data.notes) {
            const newRecords = data.data.notes.map(note => {

                return {
                    id: note.id,
                    likes: note.likes,
                    title: note.title,
                    desc: note.desc,
                    nickname: note.user.nickname,
                    images: note.user.images, // 只保存图片ID
                    userid: note.user.userid,
                    image_count: note.image_count,
                    create_time: new Date(note.create_time).toISOString(),
                    topic_name: topicName,
                    topic_id: topicId,
                    type: note.type,
                    user_red_official_verify_type: note.user.red_official_verify_type || '',
                    images_list_url: note.images_list[0].url || '',
                    video_id: note.video_id || '',
                    video_info_url: note.video_info?.url || '',
                    video_info_duration: note.video_info ? note.video_info.duration : 0,
                    video_info_played_count: note.video_info ? note.video_info.played_count : 0,
                    video_info_first_frame: note.video_info?.first_frame || '',
                    video_info_thumbnail: note.video_info?.thumbnail || '',
                    extract_time: new Date().toISOString() // 添加抽取时间
                };

            });

            logger.info(`[crawlerService] startCrawling: Extracted ${newRecords.length} new records for topicId: ${topicId}`);

            await NoteLogsService.createLog(newRecords);

            hasMore = data.data.has_more;
            cursor = data.data.cursor || '';

            if (requestCount === 0) { // 只在第一次请求时获取 totalNotesCount
                totalNotesCount = data.data.total_note_count;
            }

        } else {
            hasMore = false;
        }
        requestCount++;

        const randomInterval = getRandomInterval(config.requestInterval);
        logger.info(`[crawlerService] startCrawling: Waiting for a random interval before next request: ${randomInterval / 1000} seconds`);

        await new Promise(resolve => setTimeout(resolve, randomInterval));
    }

    // 获取爬取后的记录数
    const finalRecordCount = await await NoteLogsService.countLogs();
    newRecordsCount = finalRecordCount - initialRecordCount;

    logger.info(`[crawlerService] startCrawling: Extracted ${newRecordsCount} new records`);

    const endTime = Date.now();
    const duration = endTime - startTime; // 单位为毫秒
    logger.info(`[crawlerService] startCrawling: Crawling duration: ${duration} milliseconds`);


    // 爬取话题数据
    // 获取浏览量和单位
    const { viewCount, viewCountUnit } = await fetchTopicViews(topicId);
    logger.info(`[crawlerService] startCrawling: Fetched view count for topicId: ${topicId} - viewCount: ${viewCount}, viewCountUnit: ${viewCountUnit}`);

    const logData = {
        topic_id: topicId,
        topic_name: await TopicConfigService.getTopicNameById(topicId),
        total_notes_count: totalNotesCount,
        view_count: viewCount,
        view_count_unit: viewCountUnit,
        local_saved_notes_count: '', // 根据实际情况填写
        extract_time: new Date().toISOString()
    };
    // 在所有爬取任务完成后调用一次createLog函数
    if (!hasMore || requestCount >= config.maxRequests) {
        logger.debug(`[crawlerService] startCrawling: Calling TopicLogsService.createLog with logData = ${JSON.stringify(logData)}`);
        await TopicLogsService.createLog(logData);
        logger.info(`[crawlerService] startCrawling: Finished calling TopicLogsService.createLog`);
    }

    return { duration, newRecordsCount, requestCount, hasMore: hasMore };

}

// 从 API 获取数据
async function fetchData(topicId, cursor, sortType) {
    try {
        logger.info(`[crawlerService] fetchData: Fetching data for topicId: ${topicId} with cursor: ${cursor} using sortType: ${sortType}`);

        const randomUserAgent = config.headers.userAgents[Math.floor(Math.random() * config.headers.userAgents.length)];
        logger.info(`[crawlerService] fetchData: Using User-Agent: ${randomUserAgent}`);

        const response = await axios.get(config.baseUrl, {
            headers: {
                ...config.headers,
                'User-Agent': randomUserAgent
            },
            params: {
                page_size: config.pageSize,
                sort: sortType,
                page_id: topicId,
                cursor: cursor
            }
        });
        // 获取 total_note_count 的值
        const totalNoteCount = response.data.data.total_note_count || 0;

        // 响应数据中包含一个名为 'notes' 的数组
        const notesCount = response.data.data && response.data.data.notes ? response.data.data.notes.length : 0;
        logger.info(`[crawlerService] fetchData: Data fetched successfully for topicId: ${topicId}`);
        logger.info(`[crawlerService] fetchData: Total note count: ${totalNoteCount}`);
        logger.info(`[crawlerService] fetchData: Number of notes fetched: ${notesCount}`);

        return response.data;
    } catch (error) {
        logger.error(`[crawlerService] fetchData: Error fetching data for topicId: ${topicId} - ${error.message}`);
        throw error;
    }
}

async function fetchTopicViews(topicId) {
    const url = `https://www.xiaohongshu.com/page/topics/${topicId}`;
    logger.info(`[crawlerService] fetchTopicViews: Fetching views for topic ID ${topicId}`);

    try {
        const response = await axios.get(url);
        logger.info(`[crawlerService] fetchTopicViews: Received response for ${url}`);

        const html = response.data;
        const $ = cheerio.load(html);

        // 解析 HTML 页面，提取浏览量和单位
        const viewText = $('.summary .meta span').first().text().trim(); // 例如: "1065.3"
        const unitText = $('.summary .meta').first().text().trim(); // 例如: "1065.3万浏览"

        // 从 unitText 中提取单位
        const viewCountUnit = unitText.replace(viewText, '').replace('浏览', '').trim();

        logger.info(`[crawlerService] fetchTopicViews: Extracted view count ${viewText} and unit ${viewCountUnit} for topic ID ${topicId}`);

        return {
            viewCount: parseFloat(viewText),
            viewCountUnit: viewCountUnit // 提取 "万" 或类似单位
        };
    } catch (error) {
        logger.error(`[crawlerService] fetchTopicViews: Error fetching topic views for ${topicId}: ${error}`);
        return {
            viewCount: 0,
            viewCountUnit: ''
        };
    }
}

module.exports = { startCrawling };
