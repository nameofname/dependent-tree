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
    logger.trace(packageShallow);

    return buildTreeRecur(packageShallow);
};
