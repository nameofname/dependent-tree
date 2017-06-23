"use strict";


const path = require('path');
const fs = require('fs');
const log = require('color-log');
const multiPackageProjects = ['dibs-components', 'dibs-elements', 'dibs-utils'];
const getRepoPath = folderArr => path.resolve(__dirname, `../repos/${folderArr ? folderArr.join('/') : ''}`);


const findPackJsonInDir = (dirPath, obj) => {
    const jsonPath = `${dirPath}/package.json`;
    let packageJson;

    if (fs.existsSync(jsonPath)) {
        try {
            packageJson = require(jsonPath);
            obj[packageJson.name] = packageJson;
            log.info(`Successfully reuqired package.json from   ${jsonPath}`);
        } catch (e) {
            log.error(`package.json exists for ${dirPath} but could not be required`);
        }
    } else {
        log.info(`Skipping ${jsonPath}, no package.json found`);
    }
};


const requireEveryJson = () => {
    const packageJsonObj = {};

    fs.readdirSync(getRepoPath())
        .forEach(path => {
            if (multiPackageProjects.includes(path)) {
                fs.readdirSync(getRepoPath([path]))
                    .forEach(nestedPath => {
                        const fullNestedPath = getRepoPath([path, nestedPath]);
                        const isDir = fs.lstatSync(fullNestedPath).isDirectory();
                        if (isDir) {
                            findPackJsonInDir(fullNestedPath, packageJsonObj);
                        }
                    });
            } else {
                findPackJsonInDir(getRepoPath([path]), packageJsonObj);
            }
        });

    return packageJsonObj;
};

module.exports = () => {
    const everyJson = requireEveryJson();
    log.info(everyJson);
};
