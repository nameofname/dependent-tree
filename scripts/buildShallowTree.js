"use strict";

require('dotenv').config();
const logger = require('../src/logger');
const shallowTree = require('../src/buildShallowTree')();

logger.info(shallowTree);
