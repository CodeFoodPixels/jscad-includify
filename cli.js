#!/usr/bin/env node

'use strict';

const includify = require('./index.js');

includify.runFile(process.argv[2], process.argv[3], (err, files, code) => {
    if (err) {
        return console.error(err);
    }

    if (!process.argv[3]) {
        console.log(code);
    }
});