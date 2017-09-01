"use strict";

const request = require('request');
const path = require('path');
const fs = require('fs');
const logger = require('../lib/logger');
const oauthToken = process.env.DEPENDENT_TREE_OAUTH;
const org = process.env.DEPENDENT_TREE_ORG;


// curl -H "Authorization: token $DEPENDENT_TREE_OAUTH"  "https://api.github.com/search/code?q=filename:package.json+org:WHATEVER&per_page=50&page=1"
const getAllPackagePaths = () => {

    const perPage = 50;
    const packageSearchUrl = n => `https://api.github.com/search/code?q=filename:package.json+org:${org}&per_page=${perPage}&page=${n}`;
    let pageNum = 0;
    let results = [];
    logger.info(`Fetching package.json info for each repository from ${packageSearchUrl("X")}`);

    return new Promise((resolve, reject) => {
        const getMoreJsons = () => {
            logger.trace(`Fetching page ${pageNum}`);

            return request(packageSearchUrl(pageNum), {
                json: true,
                headers: {
                    ['Authorization']: `token ${oauthToken}`,
                    ['User-Agent']: 'node'
                }

            }, (err, res, body) => {
                if (err || res.statusCode !== 200) reject(err ? err : body);
                const items = body && body.items || [];
                results = results.concat(items);
                return (items.length >= perPage) ? getMoreJsons(++pageNum) : resolve(results);
            });
        };

        getMoreJsons();
    });
};


const getAllDownloadUrls = (resultsArr) => {

    return new Promise((resolve, reject) => {

        const downloadUrls = [];
        const getOneDownloadUrl = ((resultsArr, bypassModCheck = false) => {

            // pause half a second every 10 requests
            if (resultsArr.length % 10 === 0 && !bypassModCheck) {
                logger.trace(`Throttling half a second...`);
                setTimeout(() => getOneDownloadUrl(resultsArr, true), 500);

            } else {
                const { repository, path } = resultsArr.shift();
                const packageInfoUrl = `https://api.github.com/repos/${org}/${repository.name}/contents/${path}`;
                logger.trace(`Requesting package.json information from ${packageInfoUrl}`);

                request(packageInfoUrl, {
                    json: true,
                    headers: {
                        ['Authorization']: `token ${oauthToken}`,
                        ['User-Agent']: 'node'
                    }

                }, (err, res, body) => {
                    if (err || res.statusCode !== 200) reject(err ? err : body);
                    const { download_url } = body;
                    downloadUrls.push({ name: repository.name, path, download_url });
                    logger.trace(`Found download url at address : ${download_url}`);
                    // return resolve(downloadUrls); // for faster testing...
                    return (resultsArr.length) ? getOneDownloadUrl(resultsArr) : resolve(downloadUrls);
                });
            }
        });

        getOneDownloadUrl(resultsArr);
    });
};


const downloadPackageJson = ({ name, path: filePath, download_url, }) => {

    return new Promise((resolve, reject) => {
        logger.trace(`request package json from download url : ${download_url}`)

        return request(download_url, {
            json: true,
            headers: {
                ['Authorization']: `token ${oauthToken}`,
                ['User-Agent']: 'node'
            }

        }, (err, res, body) => {
            if (err || res.statusCode !== 200) reject(err ? err : body);
            const dst = path.resolve(`${__dirname}/../../packageJsons/${name}-${filePath.replace(/\//g, '_')}`);
            fs.writeFileSync(dst, JSON.stringify(body, null, 4));
            logger.trace(`Downloaded package.json and wrote to destination : ${dst}`);
            resolve(body);
        });
    });
};


const getPackageJsons = () => {

    getAllPackagePaths()

        .then(results => {
            logger.info(`Fetching package.json info : complete. Found ${results.length} records`);
            return getAllDownloadUrls(results);
        })

        .then(allDownloadUrls => {
            logger.info('allDownloadUrls', allDownloadUrls);
            return Promise.all(allDownloadUrls.map(downloadPackageJson))
        })

        .then(() => {
            logger.info('Downloads complete. Check out your packageJsons folder, it should be full of packages json.');
        })

        .catch(err => {
            logger.error(err);
            throw err;
        });
};


module.exports = getPackageJsons;
