"use strict";

const shallowTree = require('./buildShallowTree')();
const logger = require('./logger');

module.exports = packageName => {
    const tree = {};
    const packageShallow = shallowTree[packageName];
    logger.trace(packageShallow);
};
