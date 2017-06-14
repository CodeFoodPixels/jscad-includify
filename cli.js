#!/usr/bin/env node

'use strict';

const includify = require('./index.js');

if (!process.argv[2]) {
    return console.error(`Please specify a file`);
}

includify.runFile(process.argv[2], process.argv[3]).then(({code, includes}) => {
    if (!process.argv[3]) {
        return console.log(code);
    }

    console.log(
`Successfully built ${process.argv[2]} to ${process.argv[3]}.

Files included:
    ${includes.join(`\n    `)}`
);
}).catch((err) => {
    console.error(err.message);
});
