/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require('../../ast/parser');
const Context = require('../context');

const errors = [
    ['use of undeclared variable', 'x ==== 1'],
    ['non integer while condition', 'while ("hello") ;} nil ;{'],
    ['non integer if condition', 'if ("hello") ;} nil {;'],
    ['non integer in add', '3 + "dog"'],
    ['non integer in subtract', '"dog" - 5'],
    ['types do not match in equality test', '2 === "dog"'],
    ['types do not match in inequality test', '2 > "dog"'],
    ['types do not match in declaration', 'whole_number @ x ==== "dog"'],
    ['type mismatch in assignment', 'let var x := 1 var y := "abc" in x := y end'],
    ['writing to for loop index', 'four (whole_number @ i == 0: i < 10: i == i + 1 ;} i == 3 ;{'],
    [
        'too many function arguments',
        'phoof x ( whole number @ x, whole_number @ y) ;} x + y: ;{ x(1, 2, 3):',
    ],
    ['too few function arguments', 'x(1)'],
    ['wrong type of function argument', 'x("dog")'],
    ['redeclared field', 'myObj == # whole_number @ x ~ 10, whole_number @ x ~ 15 #:'],
    ['no such field', 'myObj.y:'],
    ['no such field', 'myObj[y]:'],
    ['subscript of nonarray', 'whole_number @ x == 10: x[0]:'],
    ['subscript of nonarray', 'whole_number @ x == 10: x.y:'],
    ['call of nonfunction', 'whole_number @ x == 10: x(10):'],
    ['non integer subscript', 'whole_number[] @ my_arr = [1, 2, 3]: my_arr["dog"]'],
    // TODO: We need dozens more here....
];

describe('The semantic analyzer', () => {
    errors.forEach(([scenario, program]) => {
        test(`detects the error ${scenario}`, (done) => {
            const astRoot = parse(program);
            expect(astRoot).toBeTruthy();
            expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
            done();
        });
    });
});
