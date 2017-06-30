"use strict";


const path = require('path');
const fs = require('fs');
const log = require('./logger');
const multiPackageProjects = ['dibs-components', 'dibs-utils'];
const specialCases = {
    '1stdibs.com': '/dibs'
};
const getRepoPath = folderArr => path.resolve(__dirname, `../repos/${folderArr ? folderArr.join('/') : ''}`);


const findPackJsonInDir = (dirPath, obj) => {
    const jsonPath = `${dirPath}/package.json`;
    let packageJson;

    if (fs.existsSync(jsonPath)) {
        try {
            packageJson = require(jsonPath);
            obj[packageJson.name] = {
                packageJson,
                packageName: packageJson.name,
                dependents: {}
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
                let pathArr = [path];
                if (specialCases[path]) {
                    pathArr.push(specialCases[path]);
                }
                findPackJsonInDir(getRepoPath(pathArr), packageObj);
            }
        });

    return packageObj;
};

const _iterateDependencies = (packageName, packageObj, depObj, type) => {
    Object.keys(depObj).forEach(dependencyName => {
        // in this case, it is one of our dependencies, so add a dependent entry to the package that packageName depends on
        if (packageObj.hasOwnProperty(dependencyName)) {
            packageObj[dependencyName].dependents[packageName] = {
                type, version: depObj[dependencyName]
            }
        }
    });
};

const buildShallowTree = (packageObj) => {
    Object.keys(packageObj).forEach(packageName => {
        const {dependencies = {}, devDependencies = {}, peerDependencies = {}} = packageObj[packageName].packageJson;
        _iterateDependencies(packageName, packageObj, dependencies, 'dependencies');
        _iterateDependencies(packageName, packageObj, devDependencies, 'devDependencies');
        _iterateDependencies(packageName, packageObj, peerDependencies, 'peerDependencies');
    });

    return packageObj;
};

module.exports = () => {
    const packageObj = requireEveryJson();
    const shallowTree = buildShallowTree(packageObj);
    const shallowTreeClone = Object.keys(shallowTree).reduce((prev, key) => {
        const {packageName, dependents} = shallowTree[key];
        prev[key] = {packageName, dependents};
        return prev;
    }, {});

    log.trace('Shallow Tree Built : ', shallowTreeClone);
    return shallowTreeClone;
};
