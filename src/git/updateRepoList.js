"use strict";

const request = require('request');
const path = require('path');
const fs = require('fs');
const oauthToken = process.env.PACKAGE_AUTOMATOR_OAUTH;
const parPage = 50;
let results = [];

// curl -H "Authorization: token $PACKAGE_AUTOMATOR_OAUTH"  "https://api.github.com/orgs/1stdibs/repos?per_page=200"
const getMoreJsons = (pageNum = 1) => {
    return request(`https://api.github.com/orgs/1stdibs/repos?per_page=100&per_page=${parPage}&page=${pageNum}`, {
        json: true,
        headers: {
            ['Authorization']: `token ${oauthToken}`,
            ['User-Agent']: 'node'
        }
    }, (err, res, body) => {
        if (err) throw err;
        if (body.length >= parPage) {
            results = [...res.items, ...results];
            getMoreJsons(++pageNum);
        } else {
            const dst = path.resolve(`${__dirname}/../../scriptOutput/allPackages.json`);
            fs.writeFileSync(dst, JSON.stringify(results, null, 4));
            console.log(`wrote file to destination ${dst}`)
        }
    });
};


module.exports = getMoreRepos;
