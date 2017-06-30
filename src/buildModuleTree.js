"use strict";


const path = require('path');
const fs = require('fs');
const log = require('./logger');
const multiPackageProjects = ['dibs-components', 'dibs-elements', 'dibs-utils'];
const getRepoPath = folderArr => path.resolve(__dirname, `../repos/${folderArr ? folderArr.join('/') : ''}`);


const findPackJsonInDir = (dirPath, obj) => {
    const jsonPath = `${dirPath}/package.json`;
    let packageJson;

    if (fs.existsSync(jsonPath)) {
        try {
            packageJson = require(jsonPath);
            obj[packageJson.name] = {
                packageJson,
                dependents : {}
            };
            log.trace(`Successfully required package.json from ${jsonPath}`);
        } catch (e) {
            log.error(`package.json exists for ${dirPath} but could not be required`);
        }
    } else {
        log.trace(`Skipping ${jsonPath}, no package.json found`);
    }
};


const requireEveryJson = () => {
    const packageObj = {};

    fs.readdirSync(getRepoPath())
        .forEach(path => {
            if (multiPackageProjects.includes(path)) {
                fs.readdirSync(getRepoPath([path]))
                    .forEach(nestedPath => {
                        const fullNestedPath = getRepoPath([path, nestedPath]);
                        const isDir = fs.lstatSync(fullNestedPath).isDirectory();
                        if (isDir) {
                            findPackJsonInDir(fullNestedPath, packageObj);
                        }
                    });
            } else {
                findPackJsonInDir(getRepoPath([path]), packageObj);
            }
        });

    return packageObj;
};

const _iterateDependencies = (packageObj, depObj, type) => {
    Object.keys(depObj).forEach(key => {
        if (packageObj.hasOwnProperty(key)) {
            packageObj[key].dependents[key] = {
                type, version: depObj[key]
            };
        }
    });
};

const buildShallowTree = (packageObj) => {
    Object.keys(packageObj).forEach(key => {
        const { packageJson } = packageObj[key];
        const {dependencies = {}, devDependencies = {}, peerDependencies = {}} = packageJson;
        _iterateDependencies(packageObj, dependencies, 'dependencies');
        _iterateDependencies(packageObj, devDependencies, 'devDependencies');
        _iterateDependencies(packageObj, peerDependencies, 'peerDependencies');
    });

    return packageObj;
};

module.exports = () => {
    const packageObj = requireEveryJson();
    const shallowTree = buildShallowTree(packageObj);
    const shallowTreeClone = Object.keys(shallowTree).reduce((prev, key) => {
        const {dependents} = shallowTree[key];
        prev[key] = {dependents};
        return prev;
    }, {});

    log.info(shallowTreeClone);
};
