"use strict";

const DependentTreeMap = require('../lib/DependentTreeMap');
const treeMap = new DependentTreeMap();

module.exports = {
    path: '/dependentTree/{pkg}',
    method: 'GET',
    config: {
        handler: (req, reply) => {
            const { pkg } = req.params;
            return reply(treeMap.getDependentTree(pkg));
        }
    }
};
