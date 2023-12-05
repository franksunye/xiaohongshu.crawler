// crawlerService.js

const { fetchData, fetchTopicViews, writeDataToCsv } = require('./dataService');
const { countCsvRecords } = require('./csvService'); // 引入计算 CSV 记录的函数
const { getTopicNameById } = require('./topicsFileService');
const topicLogService = require('./topicLogService');
const NoteLogService = require('./noteLogService');


const logger = require('../utils/logger');
const { getRandomInterval } = require('../utils/utils');
const config = require('../config');


async function startCrawling(topicId, sortType) {

    const startTime = Date.now();
    let newRecordsCount = 0;

    // 获取爬取前的记录数
    const initialRecordCount = countCsvRecords().totalRecords;

    let cursor = '';
    let hasMore = true;
    let requestCount = 0;

    // 获取话题名称
    const topicName = getTopicNameById(topicId);
    let totalNotesCount; // 在这里声明变量

    while (hasMore && requestCount < config.maxRequests) {

        logger.info(`[crawlerService] startCrawling: Starting request number: ${requestCount + 1} for topicId: ${topicId} with sortType: ${sortType}`);

        const data = await fetchData(topicId, cursor, sortType);
        if (data && data.data && data.data.notes) {
            const newRecords = data.data.notes.map(note => {

                // 提取图片ID
                const imagesId = note.user.images.split('?')[0].split('/').pop();
                const imagesListUrlId = note.images_list && note.images_list.length > 0 ? note.images_list[0].url.split('?')[0].split('/').pop() : '';
                const videoInfoUrlId = note.video_info ? note.video_info.url.split('?')[0].split('/').pop() : ''

                return {
                    id: note.id,
                    likes: note.likes,
                    title: note.title,
                    desc: note.desc,
                    nickname: note.user.nickname,
                    images: imagesId, // 只保存图片ID
                    userid: note.user.userid,
                    image_count: note.image_count,
                    create_time: new Date(note.create_time).toISOString(),
                    topic_name: topicName,
                    topic_id: topicId,
                    type: note.type,
                    user_red_official_verify_type: note.user.red_official_verify_type || '',
                    images_list_url: imagesListUrlId,
                    video_id: note.video_id || '',
                    video_info_url: videoInfoUrlId,
                    video_info_duration: note.video_info ? note.video_info.duration : 0,
                    video_info_played_count: note.video_info ? note.video_info.played_count : 0,
                    video_info_first_frame: note.video_info ? note.video_info.first_frame.split('?')[0].split('/').pop() : '',
                    video_info_thumbnail: note.video_info ? note.video_info.thumbnail.split('http://sns-img-qn.xhscdn.com/')[1] : '',
                    extract_time: new Date().toISOString() // 添加抽取时间
                };

            });

            logger.info(`[crawlerService] startCrawling: Extracted ${newRecords.length} new records for topicId: ${topicId}`);

            await NoteLogService.recordLog(newRecords);

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
    const finalRecordCount = countCsvRecords().totalRecords;
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
        topic_name: getTopicNameById(topicId),
        total_notes_count: totalNotesCount,
        view_count: viewCount,
        view_count_unit: viewCountUnit,
        local_saved_notes_count: '', // 根据实际情况填写
        extract_time: new Date().toISOString()
    };
    await topicLogService.recordLog(logData);

    return { duration, newRecordsCount, requestCount, hasMore: hasMore };

}

module.exports = { startCrawling };
