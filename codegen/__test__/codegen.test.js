/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require('../../ast/parser');
const analyze = require('../../semantics/analyzer');
const generate = require('../javascript-generator');

const fixture = {
    hello: [String.raw`poof("Hello, world\n")`, String.raw`console.log("Hello, world\n")`],

    arithmetic: [String.raw`5 * -2 + 8:`, String.raw`((5 * -2) + 8)`],

    letAndAssign: [String.raw`whole_number @ x == 3: x == 2:`, /let x_(\d+) = 3;\s+x_\1 = 2/],

    call: [
        String.raw`phoof f(whole_number @ x, array_of_chars @ y) ;} ;{ f(1, ""):`,
        /function f_(\d+)\(x_\d+, y_\d+\) \{\s*};\s*f_\1\(1, ""\)/,
    ],

    whileLoop: [String.raw`wooloop (7) ;} boof: {;`, /while \(7\) \{\s*break\s*\}/],

    forLoop: [
        String.raw`four (whole_number @ i == 0: i < 10: i++) ;} {;`,
        /let hi_(\d+) = 10;\s*for \(let i_(\d+) = 0; i_\2 <= hi_\1; i_\2\+\+\) \{\s*\}/,
    ],

    ifThen: [String.raw`gif(3) ;} 5: ;{`, '((3) ? (5) : (null))'],

    ifThenElse: [String.raw`gif(3) ;} 5: ;{ else ;} 8: ;{`, '((3) ? (5) : (8))'],

    subscript: [
        String.raw`let type r = array of string var a := r[3] of "" in print(a[0]) end`,
        /let a_(\d+) = Array\(3\).fill\(""\);\s*console.log\(a_\1\[0\]\)/,
    ],

    letAsValue: [
        String.raw`print(let var x := "dog" in concat(x, "s") end)`,
        /console.log\(\(\(\) => \{\s*let x_(\d+) = "dog";\s*return x_\1.concat\("s"\);\s*\}\)\(\)\)/,
    ],

};

describe('The JavaScript generator', () => {
    Object.entries(fixture).forEach(([name, [source, expected]]) => {
        test(`produces the correct output for ${name}`, (done) => {
            const ast = parse(source);
            analyze(ast);
            expect(generate(ast)).toMatch(expected);
            done();
        });
    });
});
