"use strict";

const path = require('path');
const fs = require('fs');
const log = require('color-log');

module.exports = () => {
    const repoDir = path.resolve(`${__dirname}/../../repos/`);
    if (!fs.existsSync(repoDir)) {
        fs.mkdirSync(repoDir);
    }
    return repoDir;
};
