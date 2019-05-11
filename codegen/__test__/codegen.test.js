/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require('../../ast/parser');
const analyze = require('../../semantics/analyzer');
const generate = require('../javascript-generator');
require('../../semantics/optimizer');

const fixture = {
    hello: [String.raw`poof("Hello, world\n"):`, String.raw`console.log("Hello, world\n")`],

    arithmetic: [String.raw`5 * -2 + 8:`, String.raw`5 * -2 + 8`],

    letAndAssign: [String.raw`whole_number @ x == 3: x == 2:`, /let x_(\d+) = 3;\s+x_\1 = 2/],

    nullVal: ['whole_number @ notInit == temp:', /let notInit_\d+ = null;/],

    noParams: ['phoof doNothing() ;} temp: ;{', /function doNothing_\d+\(\) {\s*null;\s*}/],

    call: [
        String.raw`phoof f(whole_number @ x, array_of_chars @ y) ;} ;{ f(1, ""):`,
        /function f_(\d+)\(x_\d+, y_\d+\) \{\s*}\s*f_\1\(1, ""\)/,
    ],

    whileLoop: [String.raw`wooloop (7 === 7) ;} boof: ;{`, /while \(7 === 7\) \{\s*break;\s*\}/],

    forLoop: [
        String.raw`whole_number @ hi == 10: four (whole_number @ i == 0: i <= hi: i == i + 1) ;} ;{`,
        /let hi_(\d+) = 10;\s*for \(let i_(\d+) = 0; i_\2 <= hi_\1; i_\2 = i_\2 \+ 1\) \{\s*\}/,
    ],

    ifThen: [String.raw`gif(toof) ;} 5: ;{`, /if \(true\)\s*{\s*5;\s*}/],

    ifThenElse: [
        String.raw`gif(3 === 3) ;} 5: ;{ else ;} 8: ;{`,
        /if \(3 === 3\) {\s*5;\s*} else {\s*8;\s*}/,
    ],

    arrayAccess: [
        'whole_number[] @ my_array == [0,1,2,3]: my_array[1]:',
        /let my_array_(\d+) = Array\(4\).fill\(0, 1, 2, 3\);\s*my_array_\1\[1\]/,
    ],

    objects: [
        'myObj == # whole_number @ x ~ 15, array_of_chars @ name ~ "Doofus", phoof sayHello() ;} poof("hi there"): ;{, phoof sayName(array_of_chars @ name) ;} poof(name): ;{#: myObj.x:',
        /let myObj_(\d+) = {\s*x_(\d+): 15,\s*name_(\d+): "Doofus",\s*sayHello_(\d+)\(\) {\s*console.log\("hi there"\);\s*},\s*sayName_(\d+)\(name_(\d+)\) {\s*console.log\(name_\6\);\s*}\s*};\s*myObj_\1\["x_\2"\];/,
    ],

    bigBoi: [
        'phoof fib (whole_number @ n) ;} gif (n <= 1) ;} yeet n: ;{ yeet n - 2 + n -1: ;{',
        /function fib_(\d+)\(n_(\d+)\) {\s*if \(n_\2 <= 1\) {\s*return n_\2;\s*}\s*return n_\2 - 2 \+ n_\2 - 1;/,
    ],

    bigIf: [
        'gif ( (1 > 4) ===== foof) ;} poof("troof"): ;{ elsegif (5 = 1) ;} poof(toof): ;{ else ;} poof("idk"): ;{',
        /if \(1 > 4 === false\) {\s*console.log\("troof"\);\s*}\s*else if \(5 === 1\) {\s*console.log\("toof"\);\s*}\s*else {\s*console.log\("idk"\);\s*}/,
    ],

    throw: [
        'gif(toof) ;} ;{ yack "Throw this":',
        /if \(true\) {\s*}\s*throw Error\("Throw this"\);/,
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

// Object.entries(fixture).forEach(([name, [source, expected]]) => {
//     const ast = parse(source);
//     analyze(ast);
//     ast.optimize();
//     console.log(`${name}:
//         goof: ${source}
//         js:\n${generate(ast)}\n\n`);
// });
