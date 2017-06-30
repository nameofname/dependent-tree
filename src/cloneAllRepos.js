"use strict";

const log = require('color-log');
const path = require('path');
const fs = require('fs');
const Git = require('nodegit');
const repoBlackList = [
    '1stdibs.com-archive',
    'elledecor',
    '1stdibs.com-static',
    '1stdibs-admin-v1',
    'dcs',
    'OnlineGalleries'
]; // black list of repos not to clone
const cloneOptions = {
    fetchOpts: {
        callbacks: {
            credentials: () => Git.Cred.userpassPlaintextNew(process.env.GIT_USER, process.env.GIT_PW)
        }
    }
};
let allRepos;


const authCloneUrl = (projectName, user, pass) => {
    return `https://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@github.com/${projectName}.git`;
};

const requireRepoList = () => {
    try {
        allRepos = require('../allRepos.json');
    } catch (e) {
        log.error('PLEAS READ : allRepos.json file doesn\'t exist. Run "yarn updateRepoList"\n', e);
        throw e;
    }

    // filter out urls that are empty or undefined, or black listed repositories.
    allRepos = allRepos.filter(o => {
        return !!o.clone_url && !repoBlackList.includes(o.name);
    });
};

const ensureRepoDir = () => {
    const repoDir = path.resolve(`${__dirname}/repos/`);
    if (!fs.existsSync(repoDir)) {
        log.info('Creating repository directory.');
        fs.mkdirSync(repoDir);
    }
};

const cloneNext = () => {
    if (allRepos.length) {
        cloneOne();
    } else {
        log.mark('SUCCESS! All repositories successfully cloned!');
    }
};

const cloneOne = () => {
    const repoObj = allRepos.shift();
    const { full_name, name } = repoObj;
    const dir = path.resolve(`${__dirname}/../repos/${name}`);
    const cloneUrl = authCloneUrl(full_name, process.env.GIT_USER, process.env.GIT_PW);
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

module.exports = () => {
    requireRepoList();
    ensureRepoDir();
    cloneNext();
};
