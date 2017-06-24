'use stict';

const tap = require(`tap`);
const tapshot = require(`tapshot`);
const fs = require(`fs`);
const execa = require(`execa`);

tap.test(`run with no arguments`, (childTest) => {
    process.chdir(__dirname);
    execa(`../cli.js`).then((result) => {
        childTest.equal(result.stderr, `Please specify a file`);
        childTest.end();
    });
});

tap.test(`run without output file`, (childTest) => {
    process.chdir(__dirname);
    execa(`../cli.js`, ['files/good.js']).then((result) => {
        tapshot(childTest, result.stdout, {name: 'code'});
        childTest.end();
    });
});

tap.test(`run with nonexistent input file`, (childTest) => {
    process.chdir(__dirname);
    execa(`../cli.js`, ['files/nonexistent.js']).then((result) => {
        childTest.equal(
            result.stderr,
            `Error when reading files/nonexistent.js. Error given: Error: ENOENT: no such file or directory, open 'files/nonexistent.js'`
        );
        childTest.end();
    });
});

tap.test(`run with bad input file`, (childTest) => {
    process.chdir(__dirname);
    execa(`../cli.js`, ['files/bad.js']).then((result) => {
        childTest.equal(
            result.stderr,
            `Error when reading files/nested_folder/nested_include.js. Error given: Error: ENOENT: no such file or directory, open 'files/nested_folder/nested_include.js'`
        );
        childTest.end();
    });
});

tap.test(`run with input file and output file`, (childTest) => {
    process.chdir(__dirname);
    execa(`../cli.js`, ['files/good.js', 'output/good.js']).then((result) => {
        fs.readFile(`output/good.js`, `utf8`, (err, file) => {
            if (err) {
                throw err;
            }

            tapshot(childTest, result.stdout, {name: `successMessage`})
            tapshot(childTest, file, {name: 'code'});

            fs.unlink(`output/good.js`, (err) => {
                if (err) {
                    throw err;
                }

                childTest.end();
            });
        });
    });
});

tap.test(`run with bad output file`, (childTest) => {
    process.chdir(__dirname);
    execa(`../cli.js`, ['files/good.js', 'output/nonexistent/good.js']).then((result) => {
        childTest.equal(
            result.stderr,
            `Error when writing output/nonexistent/good.js. Error given: Error: ENOENT: no such file or directory, open 'output/nonexistent/good.js'`
        );
        childTest.end();
    });
});
