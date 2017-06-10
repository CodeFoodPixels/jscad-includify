#!/usr/bin/env node

'use strict';

const includify = require('./index.js');

includify.runFile(process.argv[2], process.argv[3]).then(({code}) => {
    if (!process.argv[3]) {
        console.log(code);
    }
}).catch((err) => {
    console.error(err.message);
});
