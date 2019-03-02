const ohm = require('ohm-js');
const fs = require('fs');
const Program = require('../ast/program');
const BinaryExpression = require('../ast/binary-expression');
const VariableDeclaration = require('../ast/variable-declaration');
const AssignmentStatement = require('../ast/assignment-statement');
const NumericLiteral = require('../ast/numeric-literal');
const StringLiteral = require('../ast/string-literal');
const Return = require('../ast/return-statement');
const WhileStatement = require('../ast/while-statement');

// const GifStatement = require('../ast/gif-statement');
const grammar = ohm.grammar(fs.readFileSync('./syntax/goof3.ohm'));

const astGenerator = grammar.createSemantics().addOperation('ast', {
    Program (_1, body, _2) {
        return new Program(body.ast());
    },
    Statement_assignment (_1, v, _2, e) {
        return new VariableDeclaration(v.ast(), e.ast());
    },
    SimpleStmt_assign (v, _, e) {
        return new AssignmentStatement(v.ast(), e.ast());
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
    Exp4_increment (left, op, right) {
        return new BinaryExpression(op.ast(), left.ast(), right.ast());
    },
    numlit (_1, _2, _3, _4, _5, _6) {
        return new NumericLiteral(+this.sourceString);
    },
    strlit (_1, chars, _6) {
        return new StringLiteral(this.sourceString);
    },
    Loop_while (_, test, suite) {
        return new WhileStatement(test.ast(), suite.ast());
    }
});

// module.exports = text => {
//     const match = grammar.match(text);
//     if (!match.succeeded()) {
//         throw new Error(`Syntax Error: ${match.message}`);
//     }
//     return match.succeeded();
// };
