'use strict';

const {createLogger, format, transports} = require('winston');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.label({label: path.basename(module.parent.filename)}),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'})
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.printf(
                    info => {
                        if (info.level.includes("error")) {
                            return (chalk.red(`${info.timestamp} ${info.level}  ${info.message}`));
                        }
                        if (info.level.includes("info")) {
                            return (chalk.yellow(`${info.timestamp} ${info.level}  ${info.message}`));
                        }
                        if (info.level.includes("debug")) {
                            return (chalk.blue(`${info.timestamp} ${info.level}  ${info.message}`));
                        }
                    }
                )
            )
        }),
        new transports.File({
            filename,
            format: format.combine(
                format.printf(
                    info =>{
                        if (info.level.includes("error")) {
                            return (chalk.red(`${info.timestamp} ${info.level}  ${info.message}`));
                        }
                        if (info.level.includes("info")) {
                            return (chalk.yellow(`${info.timestamp} ${info.level}  ${info.message}`));
                        }
                        if (info.level.includes("debug")) {
                            return (chalk.blue(`${info.timestamp} ${info.level}  ${info.message}`));
                        }
                    }
                )
            )
        })
    ]
});


module.exports = function (fileName) {


    return {

        error: function (text) {
            logger.error(path.basename(fileName) + ': ' + text)
        },
        debug: function (text) {
            logger.debug(path.basename(fileName) + ': ' + text)
        },
        info: function (text) {
            logger.info(path.basename(fileName) + ': ' + text)
        },
        exitOnError: false, // do not exit on handled exceptions
    }
};

