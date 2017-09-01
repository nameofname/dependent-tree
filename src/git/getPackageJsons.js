"use strict";

const request = require('request');
const path = require('path');
const fs = require('fs');
const logger = require('../lib/logger');
const oauthToken = process.env.PACKAGE_AUTOMATOR_OAUTH;
const parPage = 50;

const downloadPackageJson = (download_url) => {
    return new Promise((resolve, reject) => {
        return request(download_url, {
            json: true,
            headers: {
                ['Authorization']: `token ${oauthToken}`,
                ['User-Agent']: 'node'
            }
        }, (err, res, body) => {
            if (err) reject(err);
            logger.info('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', res.status);
            logger.info(body);
        });
    });
};

// curl -H "Authorization: token $PACKAGE_AUTOMATOR_OAUTH"  "https://api.github.com/search/code?q=filename:package.json+org:1stdibs&per_page=50&page=1"
const getAllPackagePaths = () => {
    logger.info('Fetching package.json info for each repository');

    let pageNum = 0;
    let results = [];

    return new Promise((resolve, reject) => {
        const getMoreJsons = () => {
            logger.info(`Fetching page ${pageNum}`);
            const packageSearchUrl = `https://api.github.com/search/code?q=filename:package.json+org:1stdibs&per_page=${parPage}&page=${pageNum}`;

            return request(packageSearchUrl, {
                json: true,
                headers: {
                    ['Authorization']: `token ${oauthToken}`,
                    ['User-Agent']: 'node'
                }

            }, (err, res, body) => {
                // if (err || res.status !== 200) reject(err);
                if (err) reject(err);
                const items = body && body.items || [];
                results = results.concat(items);
                logger.info('length', items.length)
                return (items.length >= parPage) ? getMoreJsons(++pageNum) : resolve(results);
            });
        };

        getMoreJsons();
    });
};


const getPackageJsons = () => {

    const downloadPromises = [];

    getAllPackagePaths()
        .then(results => {
            logger.info('Fetching package.json info : complete.');
            results.forEach(({ download_url }) => {
                downloadPromises.push(downloadPackageJson(download_url));
            });
        })
        .catch(err => {
            throw err;
        });

};


module.exports = getPackageJsons;
