"use strict";

const log = require('color-log');
const path = require('path');
const fs = require('fs');
const Git = require('nodegit');
const repoBlackList = require('../config/repoBlackList.json'); // black list of repos not to clone
const touchRepoDir = require('../lib/touchRepoDir');
const { cloneOptions, authCloneUrl } = require('../lib/gitCredentials');

const requireRepoList = () => {
    let allRepos;
    try {
        allRepos = require('../../allRepos.json');
    } catch (e) {
        log.error('PLEAS READ : allRepos.json file doesn\'t exist. Run "yarn updateRepoList"\n', e);
        throw e;
    }

    // filter out urls that are empty or undefined, or black listed repositories.
    return allRepos.filter(o => {
        return !!o.clone_url && !repoBlackList.includes(o.name);
    });
};

const cloneThemAll = (allRepos, repoDir) => {
    const cloneNext = () => {
        if (allRepos.length) {
            cloneOne(allRepos.shift());
        } else {
            log.mark('SUCCESS! All repositories successfully cloned!');
        }
    };

    const cloneOne = (repoObj) => {
        const { full_name, name } = repoObj;
        const dir = path.resolve(`${repoDir}/${name}`);
        const cloneUrl = authCloneUrl(full_name);
        let promise;

        if (!fs.existsSync(dir)) {
            log.info(`Cloning ${name} (${cloneUrl}) into ${dir}`);
            promise = Git.Clone(cloneUrl, dir, cloneOptions);
        } else {
            log.info(`Skipping ${dir} - it already exists`);
            return cloneNext();
        }

        promise
            .then(() => {
                log.info(`Successfully cloned ${full_name}, finding more repos to clone...`);
                cloneNext();
            })
            .catch(err => { throw err });
    };

    cloneNext();
};

module.exports = () => {
    const repoList = requireRepoList();
    const repoDir = touchRepoDir();
    cloneThemAll(repoList, repoDir);
};
