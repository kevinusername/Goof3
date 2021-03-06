/*
 * Translation to JavaScript
 *
 * Requiring this module adds a gen() method to each of the AST classes, except
 * for types, and fields, which don’t figure into code generation. It exports a
 * function that generates a complete, pretty-printed JavaScript program for a
 * goof3 expression, bundling the translation of the goof3 standard library with
 * the expression's translation.
 *
 * Each gen() method returns a fragment of JavaScript.
 *
 *   const generate = require('./backend/javascript-generator');
 *   generate(goof3Expression);
 */

const prettier = require('prettier');

const {
    ArrayExpression,
    AssignmentStatement,
    BinaryExpression,
    Block,
    BreakStatement,
    CallExpression,
    Field,
    ForStatement,
    Func,
    GifStatement,
    IdExp,
    Ignore,
    Literal,
    MemberExpression,
    Method,
    ObjectExp,
    ReturnStatement,
    ThrowStatement,
    VariableDeclaration,
    WhileStatement,
} = require('../ast');

const { StringType, NullType, BoolType } = require('../semantics/builtins');

function makeOp(op) {
    // eslint-disable-next-line object-curly-newline
    return { '=': '===', '==': '===', '<>': '!==', '&': '&&', '|': '||' }[op] || op;
}

// javaScriptId(e) takes any goof3 object with an id property, such as a Variable,
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

const builtin = {
    poof([s]) {
        return `console.log(${s})`;
    },
};

module.exports = function (exp) {
    return prettier.format(exp.gen(), { parser: 'babel' });
};

ArrayExpression.prototype.gen = function () {
    const elements = this.elements.map((e) => e.gen());
    return `Array(${this.size.gen()}).fill(${elements})`;
};

AssignmentStatement.prototype.gen = function () {
    return `${this.target.gen()} = ${this.source.gen()}`;
};

BinaryExpression.prototype.gen = function () {
    return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
};

Block.prototype.gen = function () {
    if (this.statements) {
        if (Array.isArray(this.statements)) {
            const statements = this.statements.map((s) => s.gen());
            return `${statements.join(';')};`;
        }
        return `${this.statements.gen()}`;
    }
    return '';
};

BreakStatement.prototype.gen = function () {
    return 'break';
};

CallExpression.prototype.gen = function () {
    const args = this.args.map((a) => a.gen());
    if (this.callee.builtin) {
        return builtin[this.callee.id](args);
    }
    return `${javaScriptId(this.callee)}(${args.join(',')})`;
};

Field.prototype.gen = function () {
    return `${javaScriptId(this)} : ${this.value.gen()}`;
};

ForStatement.prototype.gen = function () {
    const assignments = this.assignments.map((a) => a.gen());
    const test = this.test.gen();
    return `for (${assignments}; ${test}; ${this.action.gen()}) {${this.body.gen()}}`;
};

Func.prototype.gen = function () {
    const name = javaScriptId(this);
    const params = this.parameters ? this.parameters.map((p) => javaScriptId(p)) : [''];
    return `function ${name} (${params.join(',')}) {${this.body.gen()}}`;
};

GifStatement.prototype.gen = function () {
    const tests = this.tests.map((t) => t.gen());
    const consequents = this.consequents.map((s) => `${s.gen()}`);
    let elseIfs = '';
    const ifPart = `if (${tests[0]}) {${consequents[0]}}`;
    for (let i = 1; i < consequents.length; i += 1) {
        elseIfs += `else if (${tests[i]}) {${consequents[i]}}`;
    }
    const elsePart = this.alternate ? `else {${this.alternate.gen()}}` : '';
    return `${ifPart} ${elseIfs} ${elsePart}`;
};

IdExp.prototype.gen = function () {
    return javaScriptId(this.reference);
};

Ignore.prototype.gen = function () {
    return '';
};

Literal.prototype.gen = function () {
    switch (this.type) {
    case StringType:
        return `"${this.value}"`;
    case NullType:
        return 'null';
    case BoolType:
        if (this.value === 'toof') return 'true';
        return 'false';
    default:
        return this.value;
    }
};

MemberExpression.prototype.gen = function () {
    if (this.accessType === 'array') {
        return `${this.object.gen()}[${this.property.gen()}]`;
    }
    return `${this.object.gen()}['${this.property.gen()}']`;
};

Method.prototype.gen = function () {
    const name = javaScriptId(this);
    const params = this.parameters ? this.parameters.map((p) => javaScriptId(p)) : [''];
    return `${name} (${params.join(',')}) {${this.body.gen()}}`;
};

ObjectExp.prototype.gen = function () {
    const properties = this.properties.map((p) => p.gen());
    return `{${properties.join(',')}}`;
};

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
    return `while (${this.test.gen()}) {${this.body.gen()}}`;
};
