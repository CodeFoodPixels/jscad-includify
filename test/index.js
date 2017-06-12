'use stict';

const tap = require(`tap`);
const includify = require(`../index.js`);
const snapshot = require(`./snapshots/index.js`)
const fs = require(`fs`);

process.chdir(__dirname)

tap.test(`calling run with a callback should produce the correct output`, (childTest) => {
    fs.readFile(`files/index.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, `files/`, (err, includes, code) => {
            if (err) {
                throw err;
            }

            childTest.same(includes, snapshot.includes, `Includes should be the same`);
            childTest.equal(code, snapshot.code, `Code should be the same`);
            childTest.end();
        });
    });
});

tap.test(`calling run as a promise should produce the correct output`, (childTest) => {
    fs.readFile(`files/index.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, `files/`).then(({includes, code}) => {
            childTest.same(includes, snapshot.includes, `Includes should be the same`);
            childTest.equal(code, snapshot.code, `Code should be the same`);
            childTest.end();
        }).catch((err) => {
            throw err;
        });
    });
});


tap.test(`calling runFile with a callback should produce the correct output`, (childTest) => {
    includify.runFile(`files/index.js`, (err, includes, code) => {
        if (err) {
            throw err;
        }

        childTest.same(includes, snapshot.includes, `Includes should be the same`);
        childTest.equal(code, snapshot.code, `Code should be the same`);
        childTest.end();
    });
});

tap.test(`calling run as a promise should produce the correct output`, (childTest) => {
    includify.runFile(`files/index.js`).then(({includes, code}) => {
        childTest.same(includes, snapshot.includes, `Includes should be the same`);
        childTest.equal(code, snapshot.code, `Code should be the same`);
        childTest.end();
    }).catch((err) => {
        throw err;
    });
});
