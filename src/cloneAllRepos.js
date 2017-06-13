"use strict";

const nodegit = require('nodegit');
const allRepos = require('../allRepos.json');
const allGitUrls = allRepos.map(o => o.git_url);
const path = require('path');

// TODO ! This is for immediate safety :
allGitUrls.splice(3, allGitUrls.length);
// TODO ! This is for immediate safety :


allGitUrls.forEach(url => {
    nodegit.clone(url, path.resolve(`${__dirname}/../`))
});
