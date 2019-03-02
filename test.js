/* eslint-disable node/no-deprecated-api */
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
var parse = require('./syntax/parser');
var assert = require('assert');
const fs = require('fs');

const exampleDirectory = './examples/';

describe('The grammar', () => {
    fs.readdirSync(exampleDirectory).forEach(name => {
        if (name.endsWith('.goof')) {
            it(`matches the program ${name}`, done => {
                fs.readFile(
                    `${exampleDirectory}${name}`,
                    'utf-8',
                    (err, input) => {
                        // In this test we just care that it parses without errors
                        assert.equal(parse(input), true);
                        done();
                    }
                );
            });
        } else if (name.endsWith('.error')) {
            it(`detects a syntax error in ${name}`, done => {
                fs.readFile(
                    `${exampleDirectory}/${name}`,
                    'utf-8',
                    (err, input) => {
                        // We always wrap Ohm failures in an error with text "Syntax Error"
                        assert.throws(() => parse(input), /Syntax Error/);
                        done();
                    }
                );
            });
        }
    });
});
