/* eslint-disable no-unused-vars */
const ohm = require('ohm-js');
const fs = require('fs');
const path = require('path');

const {
    ArrayExpression,
    AssignmentStatement,
    BinaryExpression,
    CallExpression,
    ForStatement,
    FunctionDeclaration,
    GifStatement,
    Identifier,
    MemberExpression,
    NumericLiteral,
    ReturnStatement,
    StringLiteral,
    ThrowStatement,
    VariableDeclaration,
    WhileStatement,
    Parameter,
    Field,
    Method,
    ObjectExp,
} = require('.');

const grammar = ohm.grammar(fs.readFileSync(path.join(__dirname, '../grammar/goof3.ohm')));

function arrayToNullable(a) {
    return a.length === 0 ? null : a[0];
}

function nonEmpty(a) {
    return a.length === 0 ? null : a;
}

function handleAccess(a) {
    const value = arrayToNullable(a);
    if (value == null) return 'global';
    return value.substring(0, value.indexOf('_')).toLowerCase();
}

const astGenerator = grammar.createSemantics().addOperation('ast', {
    Program(body) {
        return body.ast();
    },
    Line(s, _) {
        return s.ast();
    },
    Statement_assignment(access, type, _1, id, _2, e) {
        return new VariableDeclaration(handleAccess(access.ast()), type.ast(), id.ast(), e.ast());
    },
    Statement_declaration(access, type, _1, id) {
        return new VariableDeclaration(handleAccess(access.ast()), type.ast(), id.ast(), null);
    },
    Statement_reassignment(v, _, e) {
        return new AssignmentStatement(v.ast(), e.ast());
    },
    Statement_return(_1, e) {
        return new ReturnStatement(e.ast());
    },
    Statement_print(callee, _1, args, _2) {
        return new CallExpression(callee.ast(), args.ast());
    },
    Exp_logical(left, op, right) {
        return new BinaryExpression(op.ast(), left.ast(), right.ast());
    },
    Exp1_relative(left, op, right) {
        return new BinaryExpression(op.ast(), left.ast(), right.ast());
    },
    Exp2_addition(left, op, right) {
        return new BinaryExpression(op.ast(), left.ast(), right.ast());
    },
    Exp3_multiplication(left, op, right) {
        return new BinaryExpression(op.ast(), left.ast(), right.ast());
    },
    Exp4_increment(left, op) {
        return new BinaryExpression(op.ast(), left.ast());
    },
    Exp5_fCall(id, _1, args, _2) {
        return new CallExpression(id.ast(), args.ast());
    },
    numlit(_1) {
        return new NumericLiteral(+this.sourceString);
    },
    stringlit(_1, chars, _6) {
        return new StringLiteral(this.sourceString.slice(1, -1));
    },
    Loop_while(_1, _2, test, _3, _4, suite, _5) {
        return new WhileStatement(test.ast(), suite.ast());
    },
    Statement_throw(_1, e) {
        return new ThrowStatement(e.ast());
    },
    Function_declaration(_1, id, _2, args, _3, _4, body, _5) {
        return new FunctionDeclaration(id.ast(), nonEmpty(args.ast()), body.ast());
    },
    id(_1, _2) {
        return new Identifier(this.sourceString);
    },
    Loop_for(_1, _2, args, _3, test, _4, action, _5, _6, body, _7) {
        return new ForStatement(args.ast(), test.ast(), action.ast(), body.ast());
    },
    NonemptyListOf(first, _, rest) {
        return [first.ast(), ...rest.ast()];
    },
    EmptyListOf() {
        return [];
    },
    // prettier-ignore
    If(_1, _2, firstTest, _3, _4, firstBody, _5, _6, _7, moreTests, _8,
        _9, moreBodies, _10, _11, _12, lastBody, _13) {
        const tests = [firstTest.ast(), ...moreTests.ast()];
        const consequents = [firstBody.ast(), ...moreBodies.ast()];
        const alternate = arrayToNullable(lastBody.ast());
        return new GifStatement(tests, consequents, alternate);
    },
    relOp(op) {
        if (op.sourceString.length >= 2) {
            return op.sourceString.slice(0, 2);
        }
        return op.sourceString;
    },
    _terminal() {
        return this.sourceString;
    },
    Exp5_ArrayExpression(_1, elements, _2) {
        return new ArrayExpression(elements.ast());
    },
    PropAccess_brackets(id, _1, property, _2) {
        return new MemberExpression(id.ast(), property.ast());
    },
    PropAccess_dot(id, _1, property) {
        return new MemberExpression(id.ast(), property.ast());
    },
    Type(type, _1, _2) {
        return type.sourceString;
    },
    Parameter(type, _, id) {
        return new Parameter(type.ast(), id.ast());
    },
    Field(type, _1, key, _2, value) {
        return new Field(type.ast(), key.ast(), value.ast());
    },
    Method(f) {
        return new Method(f.ast());
    },
    Object(_1, body, _3) {
        return new ObjectExp(body.ast());
    },
    Statement_objDec(access, id, _, obj) {
        return new VariableDeclaration(handleAccess(access.ast()), 'object', id.ast(), obj.ast());
    },
});

module.exports = (text) => {
    const match = grammar.match(text);
    if (!match.succeeded()) {
        throw new Error(`Syntax Error: ${match.message}`);
    }
    return astGenerator(match).ast();
};
