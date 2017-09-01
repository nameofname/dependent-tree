'use strict';

const exec = require('sync-exec');
const logger = require('./../lib/logger');

module.exports = function (cmd, options) {
    options = options || {};
    if (!options.quiet) {
        logger.info(cmd);
    }

    const result = exec.apply(this, arguments);

    if (result.status !== 0) {
        return new Error(`Error running command ${cmd}. Return Value: ${result.status}.\n${result.stdout}${result.stderr}`);
    }

    return result.stdout;
};
