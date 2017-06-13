'use stict';

const tap = require(`tap`);
const includify = require(`../index.js`);
const snapshot = require(`./snapshots/index.js`)
const fs = require(`fs`);

tap.test(`run with basePath and callback`, (childTest) => {
    process.chdir(__dirname);

    fs.readFile(`files/index.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, `files/`, (err, includes, code) => {
            if (err) {
                throw err;
            }

            childTest.same(includes, snapshot.basePathIncludes, `Includes should be the same`);
            childTest.equal(code, snapshot.code, `Code should be the same`);
            childTest.end();
        });
    });
});

tap.test(`run as a promise with basepath`, (childTest) => {
    process.chdir(__dirname);

    fs.readFile(`files/index.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, `files/`).then(({includes, code}) => {
            childTest.same(includes, snapshot.basePathIncludes, `Includes should be the same`);
            childTest.equal(code, snapshot.code, `Code should be the same`);
            childTest.end();
        }).catch((err) => {
            throw err;
        });
    });
});



tap.test(`run without basePath and with callback`, (childTest) => {
    process.chdir(`${__dirname}/files`);

    fs.readFile(`index.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, (err, includes, code) => {
            if (err) {
                throw err;
            }

            childTest.same(includes, snapshot.includes, `Includes should be the same`);
            childTest.equal(code, snapshot.code, `Code should be the same`);
            childTest.end();
        });
    });
});

tap.test(`run as a promise without basepath`, (childTest) => {
    process.chdir(`${__dirname}/files`);

    fs.readFile(`index.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file).then(({includes, code}) => {
            childTest.same(includes, snapshot.includes, `Includes should be the same`);
            childTest.equal(code, snapshot.code, `Code should be the same`);
            childTest.end();
        }).catch((err) => {
            throw err;
        });
    });
});

tap.test(`runFile with callback without outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/index.js`, (err, includes, code) => {
        if (err) {
            throw err;
        }

        childTest.same(includes, snapshot.basePathIncludes, `Includes should be the same`);
        childTest.equal(code, snapshot.code, `Code should be the same`);
        childTest.end();
    });
});

tap.test(`runFile as a promise without outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/index.js`).then(({includes, code}) => {
        childTest.same(includes, snapshot.basePathIncludes, `Includes should be the same`);
        childTest.equal(code, snapshot.code, `Code should be the same`);
        childTest.end();
    }).catch((err) => {
        throw err;
    });
});

tap.test(`runFile with callback and outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/index.js`, `output/index.js`, (err, includes, code) => {
        if (err) {
            throw err;
        }

        fs.readFile(`output/index.js`, `utf8`, (err, file) => {
            if (err) {
                throw err;
            }

            childTest.same(includes, snapshot.basePathIncludes, `Includes should be the same`);
            childTest.equal(file, snapshot.code, `Code should be the same`);

            fs.unlink(`output/index.js`, (err) => {
                if (err) {
                    throw err;
                }

                childTest.end();
            });
        });

    });
});

tap.test(`runFile as a promise with outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/index.js`, `output/index.js`).then(({includes, code}) => {
        fs.readFile(`output/index.js`, `utf8`, (err, file) => {
            if (err) {
                throw err;
            }

            childTest.same(includes, snapshot.basePathIncludes, `Includes should be the same`);
            childTest.equal(file, snapshot.code, `Code should be the same`);

            fs.unlink(`output/index.js`, (err) => {
                if (err) {
                    throw err;
                }

                childTest.end();
            });
        });
    }).catch((err) => {
        throw err;
    });
});
