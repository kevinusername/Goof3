const parse = require('./syntax/parser');
const fs = require('fs');
const util = require('util');

const testFile = fs.readFileSync('./test/examples/yeet.goof');

const ast = parse(testFile);
const astText = util.inspect(ast, { depth: null });

console.log(astText);
