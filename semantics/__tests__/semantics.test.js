/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const util = require('util');
const parse = require('../../ast/parser');
const Context = require('../context');

const program = String.raw`
myObj == #
    whole_number @ x ~ 15,
    phoof myFunc (whole_number @ n) ;}
        whole_number @ m == n:
        yeet m:
    ;{
#:
`;

describe('The semantic analyzer', () => {
    test('accepts the mega program with all syntactic forms', (done) => {
        const astRoot = parse(program);
        expect(astRoot).toBeTruthy();
        console.log(astRoot);
        astRoot.forEach(e => e.analyze(Context.INITIAL));
        console.log(util.inspect(astRoot, { depth: null }));
        expect(astRoot).toBeTruthy();
        done();
    });
});
