/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require('../../ast/parser');
const Context = require('../context');

const errors = [
    ['use of undeclared variable', 'x ==== 1:'],
    ['non boolean test condition', 'wooloop ("hello") ;}  ;{'],
    ['non integer if condition', 'gif ("hello") ;}  ;{'],
    ['non integer in add', '3 + "dog":'],
    ['non integer in subtract', '"dog" - 5:'],
    ['types do not match in equality test', '2 === "dog":'],
    ['types do not match in inequality test', '2 > "dog":'],
    ['types do not match in declaration', 'whole_number @ x ==== "dog":'],
    [
        'too many function arguments',
        'phoof x ( whole_number @ x, whole_number @ y) ;} x + y: ;{ x(1, 2, 3):',
    ],
    ['too few function arguments', 'x(1):'],
    ['wrong type of function argument', 'x("dog"):'],
    ['no such field', 'myObj.y:'],
    ['wrong access type', 'myObj[x]:'],
    ['subscript of nonarray', 'whole_number @ x == 10: x[0]:'],
    ['subscript of nonarray', 'whole_number @ x == 10: x.y:'],
    ['call of nonfunction', 'whole_number @ x == 10: x(10):'],
    ['non integer subscript', 'whole_number[] @ my_arr == [1, 2, 3]: my_arr["dog"]:'],
    
];

describe('The semantic analyzer', () => {
    const initContext = new Context();
    initContext.createInitial();
    errors.forEach(([scenario, program]) => {
        test(`detects the error ${scenario}`, (done) => {
            const astRoot = parse(program);
            expect(astRoot).toBeTruthy();
            expect(() => astRoot.analyze(initContext)).toThrow();
            done();
        });
    });
});
