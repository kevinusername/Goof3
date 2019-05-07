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
    hello: [String.raw`poof("Hello, world\n"):`, String.raw`console.log("Hello, world\n")`],

    arithmetic: [String.raw`5 * -2 + 8:`, String.raw`5 * -2 + 8`],

    letAndAssign: [String.raw`whole_number @ x == 3: x == 2:`, /let x_(\d+) = 3;\s+x_\1 = 2/],

    call: [
        String.raw`phoof f(whole_number @ x, array_of_chars @ y) ;} ;{ f(1, ""):`,
        /function f_(\d+)\(x_\d+, y_\d+\) \{\s*}\s*f_\1\(1, ""\)/,
    ],

    whileLoop: [String.raw`wooloop (7 === 7) ;} boof: ;{`, /while \(7 == 7\) \{\s*break;\s*\}/],

    forLoop: [
        String.raw`whole_number @ hi == 10: four (whole_number @ i == 0: i <= hi: i == i + 1) ;} ;{`,
        /let hi_(\d+) = 10;\s*for \(let i_(\d+) = 0; i_\2 <= hi_\1; i_\2 = i_\2 \+ 1\) \{\s*\}/,
    ],

    ifThen: [String.raw`gif(3 === 3) ;} 5: ;{`, /if \(3 == 3\)\s*{\s*5;\s*}/],

    ifThenElse: [String.raw`gif(3 === 3) ;} 5: ;{ else ;} 8: ;{`, /if \(3 == 3\) {\s*5;\s*} else {\s*8;\s*}/],
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
