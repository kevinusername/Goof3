/* eslint-disable no-path-concat */
/* eslint-disable handle-callback-err */
/*
 * Parser Tests
 *
 * Tests that the parser produces the expected abstract syntax tree for a
 * variety of programs.
 */

const util = require('util');
const fs = require('fs');
const parse = require('../syntax/parser');

const astDir = __dirname + '/asts/';
const exampleDir = __dirname + '/examples/';

describe('The parser', () => {
    fs.readdirSync(exampleDir).forEach(name => {
        if (name.endsWith('.goof')) {
            test(`produces the correct AST for ${name}`, done => {
                fs.readFile(`${exampleDir}/${name}`, 'utf-8', (err, input) => {
                    const ast = parse(input);
                    const astText = util.inspect(ast, { depth: null });
                    fs.readFile(
                        `${astDir}/${name.slice(0, -4)}ast`,
                        'utf-8',
                        (_err, expected) => {
                            expect(astText).toEqual(expected.trim());
                            done();
                        }
                    );
                });
            });
        }
    });
});
