#!/usr/bin/env node

'use strict';

const includify = require('./index.js');

includify.runFile(process.argv[2], process.argv[3]).then(({code, includes}) => {
    if (!process.argv[3]) {
        console.log(code);
    } else {
        console.log(`
Successfully built ${process.argv[2]} to ${process.argv[3]}.

Files included:
    ${includes.join(`\n    `)}
`);
    }
}).catch((err) => {
    console.error(err.message);
});
