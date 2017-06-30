"use strict";

const shallowTree = require('./buildShallowTree')();
const logger = require('./logger');


const buildTreeRecur = (currNode) => {

    Object.keys(currNode.dependents).forEach(dependentName => {
        currNode.dependents[dependentName].dependents = shallowTree[dependentName].dependents;
        return buildTreeRecur(currNode.dependents[dependentName]);
    });

    return currNode;
};


module.exports = packageName => {
    const packageShallow = shallowTree[packageName];
    if (!packageShallow) {
        logger.error(`Invalid package name, ${packageName} not found in dependent map`);
        process.exit(1);
    }
    logger.trace(packageShallow);

    return buildTreeRecur(packageShallow);
};
