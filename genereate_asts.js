/* eslint-disable handle-callback-err */
const parse = require('./syntax/parser');
const fs = require('fs');
const util = require('util');

// const testFile = fs.readFileSync('./examples/bigboi.goof');

// const ast = parse(testFile);
// const astText = util.inspect(ast, { depth: null });

// console.log(astText);

const exampleDirectory = './examples/';

fs.readdirSync(exampleDirectory).forEach(name => {
    if (name.endsWith('.goof')) {
        fs.readFile(`${exampleDirectory}${name}`, 'utf-8', (err, input) => {
            const ast = parse(input);
            const astText = util.inspect(ast, { depth: null });
            fs.writeFileSync(
                `./ast/__test__/example_asts/${name.slice(0, -4)}ast`,
                astText
            );
        });
    }
});
