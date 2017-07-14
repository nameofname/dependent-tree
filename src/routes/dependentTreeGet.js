"use strict";

const DependentTreeMap = require('../lib/DependentTreeMap');
const boom = require('boom');
const treeMap = new DependentTreeMap();

module.exports = {
    path: '/dependentTree/{pkg}',
    method: 'GET',
    config: {
        handler: (req, reply) => {
            const { pkg } = req.params;
            let res;
            try {
                res = treeMap.getDependentTree(pkg);
            } catch (e) {
                return reply(boom.notFound(e));
            }
            return reply(res);
        }
    }
};
