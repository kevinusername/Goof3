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
    ['non boolean if condition', 'gif ("hello") ;}  ;{'],
    ['non integer in add', '3 + "dog":'],
    ['non integer in subtract', '"dog" - 5:'],
    ['non integer in multiply', '10 * "dog":'],
    ['non integer in divide', '"dog" / 2:'],
    ['non integer in modulo', '"dog" % 4:'],
    ['types do not match in equality test', '2 === "dog":'],
    ['types do not match in inequality test', '2 > "dog":'],
    ['types do not match in logical test', '2 || toof:'],
    ['types do not match in declaration', 'whole_number @ x ==== "dog":'],
    [
        'too many function arguments',
        'phoof f ( whole_number @ x, whole_number @ y) ;} x + y: ;{ f(1, 2, 3):',
    ],
    ['reassignment of function, wrong type', 'f == 10:'],
    ['too few function arguments', 'x(1):'],
    ['wrong type of function argument', 'x("dog"):'],
    [
        'no such field',
        'myObj == # whole_number @ x ~ 15, phoof myFunc (whole_number @ n) ;} ;{ #: myObj.y:',
    ],
    ['wrong access type', 'myObj["x"]:'],
    ['call of nonmethod', 'myObj.z():'],
    ['non subscriptable array access', 'whole_number @ x == 5: x[2]:'],
    ['non subscriptable prop access', 'whole_number @ x == 5: x.id:'],
    ['subscript of nonarray, braces', 'whole_number @ x == 10: x[0]:'],
    ['subscript of nonarray, dot', 'whole_number @ x == 10: x.y:'],
    ['call of nonfunction', 'whole_number @ x == 10: x(10):'],
    ['non integer subscript', 'whole_number[] @ my_arr == [1, 2, 3]: my_arr["dog"]:'],
    ['', ''],
    ['array of floats', 'not_whole_number[] @ array == [1, 1.5]:'],
    ['print non string', 'poof(5):'],
    ['unitialized variable when using sufix operator', 'whole_number @ x: x++: x--:'],
    ['incrementing float', 'not_whole_number @ t == 1.5: t++:'],
    ['incrementing a string', '"dog"++:'],
    ['incrementing a boolean', 'true_or_false @ tralse == toof: tralse++:'],
    ['comparing strings', '"dog" > "cat":'],
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
