'use strict';

const recast = require(`recast`);
const bluebird = require(`bluebird`);
const fs = bluebird.promisifyAll(require(`fs`));
const path = require(`path`);
const builders = recast.types.builders;

function processScript(script, basePath) {
    const includeNodes = [];
    const ast = recast.parse(script);

    recast.visit(ast, {
        visitExpressionStatement: function(p) {
            if (
                p.node.expression &&
                p.node.expression.callee &&
                p.node.expression.callee.name === 'include'
            ) {
                includeNodes.push(p);
            }

            this.traverse(p);
        }
    });

    const includePromises = includeNodes.map((p) => {
        const filePath = path.join(basePath, p.node.expression.arguments[0].value);

        return fs.readFileAsync(filePath, `utf8`).catch((err) => {
            return bluebird.reject(new Error(`Error when reading ${filePath}. Error given: ${err}`));
        }).then((file) => {
            return processScript(file, basePath);
        }).then(({ast: subAst, includes: subIncludes}) => {
            p.replace(
                builders.expressionStatement(
                    builders.callExpression(
                        builders.functionExpression(
                            null,
                            [],
                            builders.blockStatement(subAst.program.body),
                            false,
                            false
                        ),
                        []
                    )
                )
            );

            return [filePath, ...subIncludes];
        });
    });

    return bluebird.all(includePromises).reduce((includes = [], subIncludes) => {
        return includes.concat(...subIncludes);
    }).then((includes = []) => {
        return {ast, includes};
    });
}



module.exports = {
    run: (script, basePath, callback) => {
        if (typeof basePath === `function`) {
            callback = basePath;
            basePath = ``;
        }

        const newScript = processScript(script, basePath).then(({ast, includes}) => {
            return {
                code: recast.print(ast).code,
                includes
            };
        });

        if (typeof callback === `undefined`) {
            return newScript;
        }

        newScript.then(({code, includes}) => {
            callback(null, includes, code)
        }).catch((err) => {
            callback(err);
        });
    },

    runFile: (inputPath, outputPath, callback) => {
        if (typeof outputPath === `function`) {
            callback = outputPath;
            outputPath = undefined;
        }

        const runFilePromise = fs.readFileAsync(inputPath, `utf8`).catch((err) => {
            return bluebird.reject(new Error(`Error when reading ${inputPath}. Error given: ${err}`));
        }).then((script) => {
            return processScript(script, path.dirname(inputPath));
        }).then(({ast, includes}) => {
            const code = recast.print(ast).code
            if (!outputPath) {
                return bluebird.resolve([includes, code]);
            }

            return bluebird.all([
                includes,
                code,
                fs.writeFileAsync(outputPath, code).catch((err) => {
                    return bluebird.reject(new Error(`Error when writing ${outputPath}. Error given: ${err}`));
                })
            ]);
        }).then(([includes, code]) => {
            return bluebird.resolve({includes, code});
        });

        if (typeof callback === `undefined`) {
            return runFilePromise;
        }

        runFilePromise.then(({includes, code}) => {
            callback(null, includes, code);
        }).catch((err) => {
            callback(err);
        })
    }
}
