"use strict";


require('dotenv').config();
const goodLogger = require('./plugins/logger');
const Hapi = require('hapi');
const glob = require('glob');
const logger = require('./lib/logger');

const server = new Hapi.Server({ debug: { request: ['error'] } });
const conf = {
    port: process.env.NODE_PORT || 3373
};
server.connection(conf);


server.register([goodLogger], (err) => {

    if (err) {
        throw err;
    }

    server.start((err) => {
        if (err) {
            throw err;
        }

        glob.sync('/routes/**/*.js', { root : __dirname }).forEach(file => {
            server.route(require(file));
        });

        logger.info('Server running at: ' + server.info.uri);
        logger.info('Server is using configuration: ');
        logger.info(Object.assign({}, conf, {secretKey: '*********'}));
        // GOOD logger doesn't add request logging for inbound requests

        server.ext({
            type: 'onRequest',
            method: function (request, reply) {
                logger.info(`${request.method} - ${request.url.path}`);
                return reply.continue();
            }
        });
    });
});
