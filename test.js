require('dotenv').config();
const logger = require('./src/logger')
const DependentTreeMap = require('./src/DependentTreeMap');
const treeMap = new DependentTreeMap();

const result = treeMap.getDependentTree('dibs-address-form');
// const result = treeMap.getDependentTree('dibs-vg');

console.log(JSON.stringify(result));
