# jscad-includify [![Build Status](https://travis-ci.org/lukeb-uk/jscad-includify.svg?branch=master)](https://travis-ci.org/lukeb-uk/jscad-includify)

[![Greenkeeper badge](https://badges.greenkeeper.io/lukeb-uk/jscad-includify.svg)](https://greenkeeper.io/)
Build the includes for your [JSCAD](https://github.com/jscad/OpenJSCAD.org) project down into one file. Helpful for distributing a utility library or a project as a single file.

This module can be used both as a CLI tool and as a node module.

## CLI Tool

### Install

```
$ npm install -g jscad-includify
```

### Usage

```
$ jscad-includify <input file> [output file]
```
#### Examples
To build the includes for logo.jscad and then output the result to stdout:
```
$ jscad-includify logo.jscad
```
Or to build the includes for logo.jscad and then save the result in logo.built.jscad:
```
$ jscad-includify logo.jscad logo.built.jscad
```

## Node Module

### Install

```
$ npm install --save jscad-includify
```

### API

#### includify.run(code[, basePath][, callback])

- `code` _string_: String of code you wish to includify
- `basePath` _string_: Path to use as the base for the includes. Defaults to an empty string
- `callback` _function_: Function to be excuted when either an error is encountered or execution has completed. The callback is called with these parameters:
    - `error` _error_: If there was an error this will be the error object
    - `includes` _array_: Array of file paths that were included
    - `code` _string_: String of includified code 

If `callback` is ommitted then a promise is returned. If there is an error, the promise will be rejected with the error object. If the execution is successful, the promise will be fulfilled with an object containing the following:
- `includes` _array_: Array of file paths that were included
- `code` _string_: String of includified code

##### Examples
```js
// Callback example
includify.run(jscadString, (error, includes, code) => {
    ...
});

// Promise example
includify.run(jscadString).then((includes, code) => {
    ...
}).catch((error) => {
    ...
});
```

#### includify.runFile(inputPath[, outputPath][, callback])

- `inputPath` _string_: Path to the file you wish to includify
- `outputPath` _string_: Path where the output is to be saved
- `callback` _function_: Function to be excuted when either an error is encountered or execution has completed. The callback is called with these parameters:
    - `error` _error_: If there was an error this will be the error object
    - `includes` _array_: Array of file paths that were included
    - `code` _string_: String of includified code

If `callback` is ommitted then a promise is returned. If there is an error, the promise will be rejected with the error object. If the execution is successful, the promise will be fulfilled with an object containing the following:
- `includes` _array_: Array of file paths that were included
- `code` _string_: String of includified code

##### Examples
```js
// Callback example excluding output path
includify.runFile(`logo.jscad`, (error, includes, code) => {
    ...
});

// Callback example with output path
includify.runFile(`logo.jscad`, `logo.built.jscad`, (error, includes, code) => {
    ...
});

// Promise example with output path
includify.runFile(`logo.jscad`).then((includes, code) => {
    ...
}).catch((error) => {
    ...
});

// Promise example excluding output path
includify.runFile(`logo.jscad`, `logo.built.jscad`).then((includes, code) => {
    ...
}).catch((error) => {
    ...
});
```

## License
MIT © Luke Bonaccorsi
