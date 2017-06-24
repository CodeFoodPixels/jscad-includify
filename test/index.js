'use stict';

const tap = require(`tap`);
const tapshot = require(`tapshot`);
const fs = require(`fs`);

const includify = require(`../index.js`);

tap.test(`run with basePath and callback`, (childTest) => {
    process.chdir(__dirname);

    fs.readFile(`files/good.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, `files/`, (err, includes, code) => {
            if (err) {
                throw err;
            }

            tapshot(childTest, includes, {name: 'basePathIncludes'});
            tapshot(childTest, code, {name: 'code'});
            childTest.end();
        });
    });
});

tap.test(`run with basePath and callback on bad file`, (childTest) => {
    process.chdir(__dirname);

    fs.readFile(`files/bad.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, `files/`, (err, includes, code) => {
            childTest.equal(
                err.message,
                `Error when reading files/nested_folder/nested_include.js. Error given: Error: ENOENT: no such file or directory, open 'files/nested_folder/nested_include.js'`
            );
            childTest.same(includes, undefined, `Includes should be undefined`);
            childTest.equal(code, undefined, `Code should be undefined`);
            childTest.end();
        });
    });
});

tap.test(`run as a promise with basepath`, (childTest) => {
    process.chdir(__dirname);

    fs.readFile(`files/good.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, `files/`).then(({includes, code}) => {
            tapshot(childTest, includes, {name: 'basePathIncludes'});
            tapshot(childTest, code, {name: 'code'});
            childTest.end();
        }).catch((err) => {
            throw err;
        });
    });
});

tap.test(`run as a promise with basepath on bad file`, (childTest) => {
    process.chdir(__dirname);

    fs.readFile(`files/bad.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, `files/`).then(() => {
            throw `Promise should not be fulfilled`;
        }).catch((err) => {
            childTest.equal(
                err.message,
                `Error when reading files/nested_folder/nested_include.js. Error given: Error: ENOENT: no such file or directory, open 'files/nested_folder/nested_include.js'`
            );;
            childTest.end();
        });
    });
});



tap.test(`run without basePath and with callback`, (childTest) => {
    process.chdir(`${__dirname}/files`);

    fs.readFile(`good.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file, (err, includes, code) => {
            if (err) {
                throw err;
            }

            tapshot(childTest, includes, {name: 'includes'});
            tapshot(childTest, code, {name: 'code'});
            childTest.end();
        });
    });
});

tap.test(`run as a promise without basepath`, (childTest) => {
    process.chdir(`${__dirname}/files`);

    fs.readFile(`good.js`, `utf8`, (err, file) => {
        if (err) {
            throw err;
        }

        includify.run(file).then(({includes, code}) => {
            tapshot(childTest, includes, {name: 'includes'});
            tapshot(childTest, code, {name: 'code'});
            childTest.end();
        }).catch((err) => {
            throw err;
        });
    });
});

tap.test(`runFile with callback without outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/good.js`, (err, includes, code) => {
        if (err) {
            throw err;
        }

        tapshot(childTest, includes, {name: 'basePathIncludes'});
        tapshot(childTest, code, {name: 'code'});
        childTest.end();
    });
});

tap.test(`runFile with callback without outputPath on nonexistent file`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/nonexistent.js`, (err, includes, code) => {
        childTest.equal(
            err.message,
            `Error when reading files/nonexistent.js. Error given: Error: ENOENT: no such file or directory, open 'files/nonexistent.js'`
        );
        childTest.same(includes, undefined, `Includes should be undefined`);
        childTest.equal(code, undefined, `Code should be undefined`);
        childTest.end();
    });
});

tap.test(`runFile as a promise without outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/good.js`).then(({includes, code}) => {
        tapshot(childTest, includes, {name: 'basePathIncludes'});
        tapshot(childTest, code, {name: 'code'});
        childTest.end();
    }).catch((err) => {
        throw err;
    });
});

tap.test(`runFile as a promise without outputPath on nonexistent file`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/nonexistent.js`).then(() => {
        throw `Promise should not be fulfilled`;
    }).catch((err) => {
        childTest.equal(
            err.message,
            `Error when reading files/nonexistent.js. Error given: Error: ENOENT: no such file or directory, open 'files/nonexistent.js'`
        );
        childTest.end();
    });
});

tap.test(`runFile with callback and outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/good.js`, `output/good.js`, (err, includes, code) => {
        if (err) {
            throw err;
        }

        fs.readFile(`output/good.js`, `utf8`, (err, file) => {
            if (err) {
                throw err;
            }

            tapshot(childTest, includes, {name: 'basePathIncludes'});
            tapshot(childTest, code, {name: 'code'});

            fs.unlink(`output/good.js`, (err) => {
                if (err) {
                    throw err;
                }

                childTest.end();
            });
        });

    });
});

tap.test(`runFile with callback and bad outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/good.js`, `output/nonexistent/good.js`, (err, includes, code) => {
        childTest.equal(
            err.message,
            `Error when writing output/nonexistent/good.js. Error given: Error: ENOENT: no such file or directory, open 'output/nonexistent/good.js'`
        );
        childTest.same(includes, undefined, `Includes should be undefined`);
        childTest.equal(code, undefined, `Code should be undefined`);
        childTest.end();
    });
});

tap.test(`runFile as a promise with outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/good.js`, `output/good.js`).then(({includes, code}) => {
        fs.readFile(`output/good.js`, `utf8`, (err, file) => {
            if (err) {
                throw err;
            }

            tapshot(childTest, includes, {name: 'basePathIncludes'});
            tapshot(childTest, code, {name: 'code'});

            fs.unlink(`output/good.js`, (err) => {
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

tap.test(`runFile as a promise with bad outputPath`, (childTest) => {
    process.chdir(__dirname);

    includify.runFile(`files/good.js`, `output/nonexistent/good.js`).then(({includes, code}) => {
        throw `Promise should not be fulfilled`;
    }).catch((err) => {
        childTest.equal(
            err.message,
            `Error when writing output/nonexistent/good.js. Error given: Error: ENOENT: no such file or directory, open 'output/nonexistent/good.js'`
        );
        childTest.end();
    });
});
