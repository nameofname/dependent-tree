"use strict";

const path = require('path');
const fs = require('fs');
const log = require('color-log');

module.exports = () => {
    const jsonDir = path.resolve(`${__dirname}/../../packageJsons/`);
    if (!fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir);
    }
    return jsonDir;
};
