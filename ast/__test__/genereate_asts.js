/* eslint-disable handle-callback-err */

/**
 * For each example problem in the /examples/ directory, this program generates
 * an AST using parser.js. This allows each programs AST to be easily reable
 * so that its contents can be confirmed to be what is expected.
 */

const fs = require('fs');
const util = require('util');
const parse = require('../parser');

const exampleDirectory = 'examples/';

fs.readdirSync(exampleDirectory).forEach((name) => {
    if (name.endsWith('.goof')) {
        fs.readFile(`${exampleDirectory}${name}`, 'utf-8', (err, input) => {
            const ast = parse(input);
            const astText = util.inspect(ast, { depth: null });
            fs.writeFileSync(`${__dirname}/example_asts/${name.slice(0, -4)}ast`, astText);
        });
    }
});
