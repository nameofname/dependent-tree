"use strict";


const colorLog = require('color-log');
const noop = () => {};
const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
const levels = ['error', 'warn', 'info', 'trace'];
const level = levels.indexOf(logLevel);


module.exports = {
    error: message => {
        return level > -1 ? colorLog.error(message) : noop();
    },
    warn: message => {
        return level > 0 ? colorLog.warn(message) : noop();
    },
    info: message => {
        return level > 1 ? colorLog.info(message) : noop();
    },
    trace: message => {
        return level > 2 ? colorLog.info(message) : noop();
    }
};
