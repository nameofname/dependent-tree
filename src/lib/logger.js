// @flow

const colorLog = require('color-log');
const noop = () => {};
const getLevel = () => {
    const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
    const levels = ['error', 'warn', 'info', 'trace'];
    return levels.indexOf(logLevel);
};


const error = (...messages) => {
    const level = getLevel();
    return level > -1 ? colorLog.error(messages) : noop();
};
const warn = (...messages) => {
    const level = getLevel();
    return level > 0 ? colorLog.warn(messages) : noop();
};
const info = (...messages) => {
    const level = getLevel();
    return level > 1 ? colorLog.info(messages) : noop();
};
const trace = (...messages) => {
    const level = getLevel();
    return level > 2 ? colorLog.info(messages) : noop();
};

module.exports = { error, warn, info, trace };
