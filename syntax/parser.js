const ohm = require('ohm-js');
const fs = require('fs');
const path = require('path');

const Program = require('../ast/program');
const Line = require('../ast/line');
const Call = require('../ast/call-expression');
const ReturnStatement = require('../ast/return-statement');
const WhileStatement = require('../ast/while-statement');
const AssignmentStatement = require('../ast/assignment-statement');
const VariableDeclaration = require('../ast/variable-declaration');
const BinaryExpression = require('../ast/binary-expression');
const NumericLiteral = require('../ast/numeric-literal');
const StringLiteral = require('../ast/string-literal');
const ThrowStatement = require('../ast/throw-statement');
const FunctionDeclaration = require('../ast/function-declaration');
const ForStatement = require('../ast/for-statement');
const GifStatement = require('../ast/gif-statment');
const Id = require('../ast/id');
const ArrayExpression = require('../ast/array-expression');
const MemberExpression = require('../ast/member-expression');

const grammar = ohm.grammar(
    fs.readFileSync(path.join(__dirname, '/goof3.ohm'))
);

function arrayToNullable (a) {
    return a.length === 0 ? null : a[0];
}

const astGenerator = grammar.createSemantics().addOperation('ast', {
    Program (body) {
        return new Program(body.ast());
    },
    Line (s, _) {
        return new Line(s.ast());
    },
    Statement_assignment (_1, v, _2, e) {
        return new VariableDeclaration(v.ast(), e.ast());
    },
    Statement_reassignment (v, _, e) {
        return new AssignmentStatement(v.ast(), e.ast());
    },
    Statement_return (_1, e) {
        return new ReturnStatement(e.ast());
    },
    Statement_print (callee, _1, args, _2) {
        return new Call(callee.ast(), args.ast());
    },
    Exp_logical (left, op, right) {
        return new BinaryExpression(op.ast(), left.ast(), right.ast());
    },
    Exp1_relative (left, op, right) {
        return new BinaryExpression(op.ast(), left.ast(), right.ast());
    },
    Exp2_addition (left, op, right) {
        return new BinaryExpression(op.ast(), left.ast(), right.ast());
    },
    Exp3_multiplication (left, op, right) {
        return new BinaryExpression(op.ast(), left.ast(), right.ast());
    },
    Exp4_increment (left, op) {
        return new BinaryExpression(op.ast(), left.ast());
    },
    Exp5_fCall (id, _1, args, _2) {
        return new Call(id.ast(), args.ast());
    },
    numlit (_1) {
        return new NumericLiteral(+this.sourceString);
    },
    stringLit (_1, chars, _6) {
        return new StringLiteral(this.sourceString);
    },
    Loop_while (_1, _2, test, _3, _4, suite, _5) {
        return new WhileStatement(test.ast(), suite.ast());
    },
    Statement_throw (_1, e) {
        return new ThrowStatement(e.ast());
    },
    Function_declaration (_1, id, _2, args, _3, _4, body, _5) {
        return new FunctionDeclaration(id.ast(), args.ast(), body.ast());
    },
    id (_1, _2) {
        return new Id(this.sourceString);
    },
    Loop_for (_1, _2, args, _3, test, _4, action, _5, _6, body, _7) {
        return new ForStatement(
            args.ast(),
            test.ast(),
            action.ast(),
            body.ast()
        );
    },
    NonemptyListOf (first, _, rest) {
        return [first.ast(), ...rest.ast()];
    },
    EmptyListOf () {
        return [];
    },
    // prettier-ignore
    If (_1, _2, firstTest, _3, _4, firstBody, _5, _6, _7, moreTests, _8,
        _9, moreBodies, _10, _11, _12, lastBody, _13) {
        const tests = [firstTest.ast(), ...moreTests.ast()];
        const consequents = [firstBody.ast(), ...moreBodies.ast()];
        const alternate = arrayToNullable(lastBody.ast());
        return new GifStatement(tests, consequents, alternate);
    },
    relOp (op) {
        if (op.sourceString.length >= 2) {
            return op.sourceString.slice(0, 2);
        }
        return op.sourceString;
    },
    _terminal () {
        return this.sourceString;
    },
    Exp5_ArrayExpression (_1, elements, _2) {
        return new ArrayExpression(elements.ast());
    },
    PropAccess_brackets (id, _1, property, _2) {
        return new MemberExpression(id.ast(), property.ast());
    },
    PropAccess_dot (id, _1, property) {
        return new MemberExpression(id.ast(), property.ast());
    }
});

module.exports = text => {
    const match = grammar.match(text);
    if (!match.succeeded()) {
        throw new Error(`Syntax Error: ${match.message}`);
    }
    return astGenerator(match).ast();
};
