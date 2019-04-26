/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require('../../ast/parser');
const Context = require('../context');

const programs = [
    String.raw`
    myObj == #
        whole_number @ x ~ 15,
        phoof myFunc (whole_number @ n) ;}
            whole_number @ m == n:
            yeet m:
        ;{
    #:`,

    String.raw`
    phoof swapWithoutTemp (whole_number @ a, whole_number @ b) ;}
        a ==== a - b:
        b == a + b:
        a ======== b - a:
        yeet a:
    ;{
    swapWithoutTemp(30, 11):`,

    String.raw`
    not_whole_number @ x == 5 + 10.5:
    `,

    String.raw`
    array_of_chars @ mongo ==== "BigBoi":
    true_or_false @ isHeTho ====== toof:
    phoof bSD(array_of_chars @  name, true_or_false @ check) ;}
        gif (check =========== toof) ;}
            yeet "Mongo is a Big Swinging Dick":
        ;{
    ;{
    bSD(mongo, isHeTho):`,

    String.raw`
    phoof myFunc() ;}
        whole_number @ v ==== 0:
        four (whole_number @ j ==== 0: j<1000: j ==== j + 1) ;}
            v ==== v + j:
        ;{
        yack "haha":
    ;{
    `,

    String.raw`
    whole_number @ x == 5:
    x++:`,
];

describe('The semantic analyzer', () => {
    test('accepts the mega program with all syntactic forms', (done) => {
        programs.forEach((program) => {
            const astRoot = parse(program);
            expect(astRoot).toBeTruthy();
            astRoot.forEach(e => e.analyze(Context.INITIAL));
            expect(astRoot).toBeTruthy();
            done();
        });
    });
});
