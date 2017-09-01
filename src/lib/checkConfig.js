"use strict";

require('dotenv').config();
const logger = require('./logger');

const arr = ['DEPENDENT_TREE_ORG', 'DEPENDENT_TREE_OAUTH', 'GIT_USER', 'GIT_PW'];
module.exports = () => {
    arr.forEach(confString => {
        if (!process.env[confString]) {
            logger.error('setup step is not complete - each of the following configurations is required in your .env file : \n', arr.join(', '));
            const err = new Error("Incomplete configuration");
            throw err;
        }
    });
};
