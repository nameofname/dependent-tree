"use strict";

const path = require('path');
const logger = require('./logger');
const dotenvPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: dotenvPath });

const arr = ['DEPENDENT_TREE_ORG', 'DEPENDENT_TREE_OAUTH', 'GIT_USER'];
module.exports = () => {
    arr.forEach(confString => {
        if (!process.env[confString]) {
            logger.error('setup step is not complete - each of the following configurations is required in your .env file : \n', arr.join(', '));
            const err = new Error("Incomplete configuration");
            throw err;
        }
    });
};
