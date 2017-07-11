"use strict";

require('dotenv').config();
const commander = require('commander');
const logger = require('../src/logger');
const DependentTreeMap = require('../src/DependentTreeMap');
const treePrinter = require('../src/treePrinter');

commander
    .option('-p, --package [value]', 'Package name to build dependent tree for')
    .parse(process.argv);

if (!commander.package) {
    logger.trace('commander object state : ', commander);
    logger.error('package name is required, please supply a package argument (--package [value], -p [value])');
    process.exit(1);
}

const treeMap = new DependentTreeMap();

treePrinter(treeMap.getDependentTree(commander.package));
