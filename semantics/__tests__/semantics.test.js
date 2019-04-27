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
    #:
    myObj.x == 10:
    `,

    String.raw`
    phoof swapWithoutTemp (whole_number @ a, whole_number @ b) ;}
        a ==== a - b:
        b == a + b:
        a ======== b - a:
        yeet a:
    ;{
    swapWithoutTemp(30, 11):`,

    String.raw`
    not_whole_number @ x == 5 + 10.5:`,

    String.raw`
    array_of_chars @ mongo ==== "BigBoi":
    true_or_false @ isHeTho ====== toof:
    phoof bSD(array_of_chars @  name, true_or_false @ check) ;}
        gif (check =========== toof) ;}
            yeet "(amelia)there is no lifeguard at your beach, (lumberjack simmons) this is not a beach, wait wtf are you doing in (bangs head on bed, not amelia) FUCK!!":
            yeet "And they don't stop forking and they don't stop forking":
            yeet "AHHHH I just died in your arms tonight, it must have been something you forked":        
            yeet "How much repo would a fuzzy fork fork if a fuzzy could fork would fork fork fork fork?":
            yeet "Mongo (aka JL aka John Lopez aka Mongo aka TurboTard) has a big swinging bat":
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
    ;{`,

    String.raw`
    whole_number @ x == 5:
    x++:`,

    String.raw`
    array_of_chars @ myStr == "hello":
    poof(myStr):
    `,

    String.raw`
    whole_number[] @ myArr == [1,2,3,4]:
    myArr[1] == 5:
    `,

    String.raw`
    wooloop (toof || 2 > 1) ;}
        poof("infinite woo"):
    ;{
    `,
];

describe('The semantic analyzer', () => {
    test('accepts the mega program with all syntactic forms', (done) => {
        programs.forEach((program) => {
            const initContext = new Context();
            initContext.createInitial();
            const astRoot = parse(program);
            expect(astRoot).toBeTruthy();
            astRoot.forEach(e => e.analyze(initContext));
            expect(astRoot).toBeTruthy();
            done();
        });
    });
});
