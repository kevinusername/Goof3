/* eslint-disable handle-callback-err */

const fs = require('fs');
const syntaxCheck = require('../syntax-checker');

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
                        expect(syntaxCheck(input)).toBeTruthy();
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
                        expect(() => syntaxCheck(input)).toThrow(/Syntax Error/);
                        done();
                    }
                );
            });
        }
    });
});
