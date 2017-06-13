"use strict";

const request = require('request');
const path = require('path');
const fs = require('fs');
const oauthToken = process.env.PACKAGE_AUTOMATOR_OAUTH;
let allRepos = [];


// curl -H "Authorization: token $PACKAGE_AUTOMATOR_OAUTH"  "https://api.github.com/orgs/1stdibs/repos?per_page=200"
const getMoreRepos = (pageNum = 0) => {
    return request(`https://api.github.com/orgs/1stdibs/repos?per_page=100&page=${pageNum}`, {
        json: true,
        headers: {
            ['Authorization']: `token ${oauthToken}`,
            ['User-Agent']: 'node'
        }
    }, (err, res, body) => {
        if (err) throw err;
        if (body.length) {
            allRepos = allRepos.concat(body);
            getMoreRepos(++pageNum);
        } else {
            const dst = path.resolve(`${__dirname}/../allRepos.json`);
            fs.writeFileSync(dst, JSON.stringify(allRepos));
            console.log(`wrote file to destination ${dst}`)
        }
    });
};


module.exports = getMoreRepos;
