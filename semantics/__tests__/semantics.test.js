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
            yeet "Success":
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
    x++:
    whole_number @ x == 10:
    `,

    String.raw`
    array_of_chars @ myStr == "hello":
    poof(myStr):

    array_of_chars @ nullString == temp:
    `,

    String.raw`
    not_whole_number[] @ myArr == [1,2,3,4, 5.5]:
    myArr[1] == 5:

    gif (myArr[1] = 5) ;}
        poof("got here"):
    ;{ else ;}
        poof("didn't get here"):
    ;{

    array_of_chars[] @ strArray:
    array_of_chars[] @ strArray == []:
    `,

    String.raw`
    wooloop (toof || 2 > 1) ;}
        poof("infinite woo"):
    ;{
    whole_number @ x:
    not_whole_number @ y == 15:
    `,
];

// describe('The semantic analyzer', () => {
//     programs.forEach((program) => {
//         test('accepts the mega program with all syntactic forms', (done) => {
//             const initContext = new Context();
//             initContext.createInitial();
//             const astRoot = parse(program);
//             expect(astRoot).toBeTruthy();
//             astRoot.forEach(e => e.analyze(initContext));
//             expect(astRoot).toBeTruthy();
//             done();
//         });
//     });
// });

programs.forEach((program) => {
    const initContext = new Context();
    initContext.createInitial();
    const astRoot = parse(program);
    astRoot.forEach((e) => {
        e.analyze(initContext);
        console.log(e);
    });
});
