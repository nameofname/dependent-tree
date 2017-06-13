"use strict";


const request = require('request');
const nodegit = require('nodegit');
const fs = require('fs');
const oauthToken = process.env.PACKAGE_AUTOMATOR_OAUTH;
let allRepos = [];

console.log(`${process.cwd()}/allRepos.json`)

// curl -H "Authorization: token $PACKAGE_AUTOMATOR_OAUTH"  "https://api.github.com/orgs/1stdibs/repos?per_page=200"
const getMoreRepos = (pageNum = 0) => {
    // return request(`http://google.com`, (err, res, body) => {
    return request(`https://api.github.com/orgs/1stdibs/repos?per_page=100&page=${pageNum}`, {
        json: true,
        headers: {
            ['Authorization']: `token ${oauthToken}`,
            ['User-Agent']: 'node'
        }
    }, (err, res, body) => {
        if (err) throw err;
        if (body.length) {
            console.log(body.length, pageNum)
            allRepos = allRepos.concat(body);
            getMoreRepos(++pageNum);
        } else {
            fs.writeFileSync(`${process.cwd()}/allRepos.json`, JSON.stringify(allRepos))
        }
    });
};


module.exports = {
    updateAllRepos: getMoreRepos
};
