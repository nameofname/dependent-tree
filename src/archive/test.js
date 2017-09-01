require('dotenv').config();
const logger = require('./../lib/logger')
const DependentTreeMap = require('./../lib/DependentTreeMap');
const treeMap = new DependentTreeMap();

const result = treeMap.getDependentTree('dibs-address-form');
// const result = treeMap.getDependentTree('dibs-vg');

console.log(JSON.stringify(result));
