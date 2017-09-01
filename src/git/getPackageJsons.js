"use strict";

const request = require('request');
const path = require('path');
const fs = require('fs');
const oauthToken = process.env.PACKAGE_AUTOMATOR_OAUTH;
const parPage = 10;
let results = [];

// curl -H "Authorization: token $PACKAGE_AUTOMATOR_OAUTH"  "https://api.github.com/search/code?q=filename:package.json+org:1stdibs&per_page=50&page=1"
const getPackageJsons = (pageNum = 0) => {
    const url = `https://api.github.com/search/code?q=filename:package.json+org:1stdibs&per_page=${parPage}&page=${pageNum}`;
    console.log(`getting from url ${url}`)
    return request(url, {
        json: true,
        headers: {
            ['Authorization']: `token ${oauthToken}`,
            ['User-Agent']: 'node'
        }
    }, (err, res, body) => {
        if (err) throw err
        const items = body && body.items || [];
        results = [...items, ...results];
        if (items.length >= parPage) {
            getPackageJsons(++pageNum);
        } else {
            const dst = path.resolve(`${__dirname}/../../scriptOutput/allPackages.json`);
            fs.writeFileSync(dst, JSON.stringify(results, null, 4));
            console.log(`wrote file to destination ${dst}`)
        }
    });
};


module.exports = getPackageJsons;
