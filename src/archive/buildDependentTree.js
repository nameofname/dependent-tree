"use strict";

const shallowTree = require('./buildShallowTree')();
const logger = require('./../logger');


const buildTreeRecur = (currNode, pathToNode) => {

    const occurrences = pathToNode.filter(n => n === currNode.packageName).length;
    if (occurrences > 1) {
        log.warn(`found circular dependency for ${currNode.packageName}, path : ${JSON.stringify(pathToNode)}`);
        return;
    }

    Object.keys(currNode.dependents).forEach(dependentName => {
        currNode.dependents[dependentName].dependents = shallowTree[dependentName].dependents;
        currNode.dependents[dependentName].packageName = dependentName;
        const newPathToNode = [...pathToNode, dependentName];
        return buildTreeRecur(currNode.dependents[dependentName], newPathToNode);
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

    return buildTreeRecur(packageShallow, [packageName]);
};
