/*
 * Translation to JavaScript
 *
 * Requiring this module adds a gen() method to each of the AST classes, except
 * for types, and fields, which don’t figure into code generation. It exports a
 * function that generates a complete, pretty-printed JavaScript program for a
 * Tiger expression, bundling the translation of the Tiger standard library with
 * the expression's translation.
 *
 * Each gen() method returns a fragment of JavaScript.
 *
 *   const generate = require('./backend/javascript-generator');
 *   generate(tigerExpression);
 */

const format = require('prettier-eslint');

const {
    ArrayExpression,
    AssignmentStatement,
    BinaryExpression,
    Block,
    CallExpression,
    Field,
    ForStatement,
    Func,
    GifStatement,
    IdExp,
    Literal,
    MemberExpression,
    Method,
    ObjectExp,
    Parameter,
    ReturnStatement,
    ThrowStatement,
    VariableDeclaration,
    WhileStatement,
} = require('../ast');

// const Context = require('../semantics/context');
const { StringType } = require('../semantics/builtins');

function makeOp(op) {
    return { '=': '===', '<>': '!==', '&': '&&', '|': '||' }[op] || op;
}

// javaScriptId(e) takes any Tiger object with an id property, such as a Variable,
// Param, or Func, and produces a JavaScript name by appending a unique identifying
// suffix, such as '_1' or '_503'. It uses a cache so it can return the same exact
// string each time it is called with a particular entity.
const javaScriptId = (() => {
    let lastId = 0;
    const map = new Map();
    return (v) => {
        if (!map.has(v)) {
            map.set(v, ++lastId); // eslint-disable-line no-plusplus
        }
        return `${v.id}_${map.get(v)}`;
    };
})();

// function generateLibraryFunctions() {
//     function generateLibraryStub(name, params, body) {
//         // const entity = Context.INITIAL.valueMap.get(name);
//         return `function ${javaScriptId(name)}(${params}) {${body}}`;
//     }
//     return [generateLibraryStub('print', 's', 'console.log(s);')].join('');
// }

module.exports = function (exp) {
    // const libraryFunctions = generateLibraryFunctions();
    // Separate with a semicolon to avoid possible translation as a function call
    // exp.forEach(e => e.gen());
    const sourceCode = `${exp.gen()}`;
    // const options = {
    //     text: sourceCode,
    //     filePath: './.eslintrc.json',
    //     parser: 'babylon',
    // };
    // const program = format(options);
    return sourceCode;
};

ArrayExpression.prototype.gen = function () {
    const elements = this.elements.map(e => e.gen());
    return `Array(${this.size.gen()}).fill(${elements})`;
};

// ArrayType.prototype.gen = function () {
//     return `${this.type.gen}`;
// };

AssignmentStatement.prototype.gen = function () {
    return `${this.target.gen()} = ${this.source.gen()}`;
};

BinaryExpression.prototype.gen = function () {
    return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
};

Block.prototype.gen = function () {
    if (Array.isArray(this.statements)) {
        const statements = this.statements.map(s => s.gen());
        return `${statements.join(';')};`;
    }
    return `${this.statements.gen()};`;
};

CallExpression.prototype.gen = function () {
    const args = this.args.map(a => a.gen());
    return `${javaScriptId(this.callee)}(${args.join(',')})`;
};

Field.prototype.gen = function () {
    return `${javaScriptId(this)} : ${this.value.gen()}`;
};

ForStatement.prototype.gen = function () {
    const body = this.body.gen();
    const assignments = this.assignments.map(a => a.gen());
    const test = this.test.gen();
    return `for (${assignments}; ${test}; ${this.action.gen()}) {${body}}`;
};

Func.prototype.gen = function () {
    const name = javaScriptId(this);
    const params = this.parameters ? this.parameters.map(p => javaScriptId(p)) : '';
    const body = this.body.gen();
    return `function ${name} (${params.join(',')}) {${body}}`;
};

GifStatement.prototype.gen = function () {
    const thenPart = this.consequents ? this.consequents.map(s => s.gen()) : '';
    const elsePart = this.alternate ? this.alternate.gen() : '';
    return `if (${this.tests[0].gen()}) {${thenPart[0]}} ${elsePart}`;
};

IdExp.prototype.gen = function () {
    return javaScriptId(this.reference);
};

Literal.prototype.gen = function () {
    return this.type === StringType ? `"${this.value}"` : this.value;
};

MemberExpression.prototype.gen = function () {
    return `${this.object.gen()}[${this.property.gen()}]`;
};

Method.prototype.gen = function () {
    const name = javaScriptId(this);
    const params = this.params.map(p => javaScriptId(p));
    let body = this.body.gen();
    if (this.body.type) {
        // "Void" functions do not have a JS return, others do
        body = `return ${body}`;
    }
    return `function ${name} (${params.join(',')}) {${body}}`;
};

ObjectExp.prototype.gen = function () {
    const properties = this.properties.map(p => p.gen());
    return `${properties.join(',')}`;
};

Parameter.prototype.gen = function () {
    return javaScriptId(this);
};

// PrimitiveType.prototype.gen = function () {
//     return `${this.type}`;
// };

ReturnStatement.prototype.gen = function () {
    return `return ${this.returnValue.gen()}`;
};

ThrowStatement.prototype.gen = function () {
    return `throw Error(${this.error.gen()})`;
};

VariableDeclaration.prototype.gen = function () {
    return `let ${javaScriptId(this)} = ${this.initializer.gen()}`;
};

WhileStatement.prototype.gen = function () {
    return `while (${this.test.gen()}) { ${this.body.gen()}))`;
};
