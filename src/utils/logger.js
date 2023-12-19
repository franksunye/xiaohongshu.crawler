// logger.js

const winston = require('winston');
const config = require('../config');

const transports = [
    new winston.transports.File({
        filename: 'logs.log',
        level: 'info', // 设置文件传输的日志级别为 debug
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`)
        )
    })
];

if (config.logToConsole) {
    transports.push(
        new winston.transports.Console({
            level: 'info', // 设置控制台传输的日志级别为 debug
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`)
            )
        })
    );
}

const logger = winston.createLogger({
    level: 'info', // 设置日志记录器的最低日志级别为 debug
    transports: transports
});

module.exports = logger;
