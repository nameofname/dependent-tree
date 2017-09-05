#!/usr/bin/env node
"use strict";

require('dotenv').config();
require('../src/lib/checkConfig')();
const path = require('path');
const fs = require('fs');
const commander = require('commander');
const logger = require('../src/lib/logger');
const DependentTreeMap = require('../src/lib/DependentTreeMap');
const getPackageJsons = require('../src/git/getPackageJsons');
const treePrinter = require('../src/lib/treePrinter');

commander
    .option('-p, --package [value]', 'Package name to build dependent tree for')
    .option('-u, --update', 'Update packages')
    .option('-j, --json', 'Print output in JSON format')
    .parse(process.argv);

if (commander.update) {
    getPackageJsons()
        .then(() => {
            process.exit(0);
        })
        .catch(() => {
            process.exit(1);
        });

} else {
    const jsonDir = path.resolve(`${__dirname}/../packageJsons/`);
    if (!fs.existsSync(jsonDir)) {
        logger.error('No package.json files found to compare. Please run dependent-tree --update (-u)')
    }

    if (!commander.package) {
        logger.trace('commander object state : ', commander);
        logger.error('package name is required, please supply a package argument (--package [value], -p [value])');
        process.exit(1);
    }

    const treeMap = new DependentTreeMap();
    const result = treeMap.getDependentTree(commander.package);

    return (commander.json) ? console.log(JSON.stringify(result, null, 2)) : treePrinter(result);
}

