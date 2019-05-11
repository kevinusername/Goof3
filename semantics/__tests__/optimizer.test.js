/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require('../../ast/parser');
const analyze = require('../../semantics/analyzer');
const generate = require('../../codegen/javascript-generator');
require('../../semantics/optimizer');

const fixture = {
    arithmetic: [String.raw`5 * -2 + 8:`, String.raw`-2`],

    letAndAssign: [String.raw`whole_number @ x == 3: x == 2:`, /let x_(\d+) = 3;\s+x_\1 = 2/],

    nullVal: ['whole_number @ notInit == temp:', /let notInit_\d+ = null;/],

    noParams: ['phoof doNothing() ;} temp: ;{', /function doNothing_\d+\(\) {\s*null;\s*}/],

    call: [
        String.raw`phoof f(whole_number @ x, array_of_chars @ y) ;} ;{ f(1, ""):`,
        /function f_(\d+)\(x_\d+, y_\d+\) \{\s*}\s*f_\1\(1, ""\)/,
    ],

    whileLoop: [String.raw`wooloop (7 === 7) ;} boof: ;{`, /while \(true\) \{\s*break;\s*\}/],

    forLoop: [
        String.raw`whole_number @ hi == 10: four (whole_number @ i == 0: i <= hi: i == i + 1) ;} ;{`,
        /let hi_(\d+) = 10;\s*for \(let i_(\d+) = 0; i_\2 <= hi_\1; i_\2 = i_\2 \+ 1\) \{\s*\}/,
    ],

    ifThen: [String.raw`gif(toof) ;} 5: ;{`, /if \(true\)\s*{\s*5;\s*}/],

    ifThenElse: [
        String.raw`gif(3 === 3) ;} 5: ;{ else ;} 8: ;{`,
        /if \(true\) {\s*5;\s*} else {\s*8;\s*}/,
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
        /if \(true === false\) {\s*console.log\("troof"\);\s*}\s*else {\s*console.log\("idk"\);\s*}/,
    ],

    throw: ['gif(toof) ;} ;{ yack "Throw this":', /throw Error\("Throw this"\);/],

    bunchOfOpts: [
        String.raw`whole_number @ x == 2 * 8:
        gif ((0 * 9) ===== 0) ;} 
          yeet("toof"):    
        ;{
        elsegif (foof) ;}
          poof("optimizer will remove this"):
        ;{
        elsegif (toof || foof) ;}
          poof("this will still happen"):
        ;{
        elsegif (5 > 4) ;}
          xD but this empty case will be removed entirely
        ;{
        else ;};{ xD but this will be also be removed in optimization
        
        foof || toof:
        foof && toof:
        5 <  2:
        
        5 === 5:
                
        5 + 5:`,

        /let x_18 = 16;\s*if \(true\) {\s* {2}return "toof";\s*} else if \(true\) {\s* {2}console.log\("this will still happen"\);\s*}\s*true;\s*false;\s*true;\s*true;\s*10;\s*/,
    ],

    moreOpts: [
        String.raw`wooloop (foof) ;};{
        wooloop (toof) ;};{
        5 * 2.5:
        5 + 0:
        5 * 0:
        5 - 0:
        toof && foof:
        foof || toof:
        whole_number @ newnum == 10:
        toof || newnum === newnum:
        newnum == newnum:
        5 != 4:
        `,
        /12.5;\s*5;\s*0;\s*5;\s*false;\s*true;\s*let newnum_19 = 10;\s*true;\s*true;\s*$/,
    ],
};

describe('The JavaScript generator', () => {
    Object.entries(fixture).forEach(([name, [source, expected]]) => {
        test(`produces the correct output for ${name}`, (done) => {
            const ast = parse(source);
            analyze(ast);
            ast.optimize();
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
