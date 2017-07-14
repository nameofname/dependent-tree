"use strict";

// const repoBlackList = require('../config/repoBlackList.json'); // black list of repos not to clone
// const path = require('path');
// const Git = require('nodegit');
// const { cloneOptions, authCloneUrl } = require('../lib/gitCredentials');


const fs = require('fs');
const log = require('color-log');
const touchRepoDir = require('../lib/touchRepoDir');
const exec = require('../lib/exec');



const pullThemAll = (repoDir) => {
    const dirs = fs.readdirSync(repoDir);
    dirs.forEach(dir => {
        const repo = `${repoDir}/${dir}`;
        const result = exec(`cd ${repo} && git pull --rebase origin master`);
        return (result instanceof Error) ? log.error(result) : log.info(result);

    });
};

module.exports = () => {
    const repoDir = touchRepoDir();
    pullThemAll(repoDir);
};
