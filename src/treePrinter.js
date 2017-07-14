"use strict";

const colors = require('colors');

const treePrinter = (dependentTree, currLevel = 0) => {
    const indent = new Array(currLevel).fill('|      ').join('');
    Object.keys(dependentTree).forEach(depName => {
        const { dependents, type, version } = dependentTree[depName];
        const line = `${indent}├── ${depName} (${colors.yellow(type, version)})`;
        console.log(colors.green(line));
        if (dependents) {
            treePrinter(dependentTree[depName].dependents, (currLevel + 1));
        }
    });
};

module.exports = treePrinter;
