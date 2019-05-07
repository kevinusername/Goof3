/* eslint-disable no-unused-vars */
const ohm = require('ohm-js');
const fs = require('fs');
const path = require('path');

const {
    ArrayExpression,
    ArrayType,
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
    Literal,
    MemberExpression,
    Method,
    ObjectExp,
    Parameter,
    ReturnStatement,
    ThrowStatement,
    VariableDeclaration,
    WhileStatement,
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
        return new Block(body.ast());
    },
    Block(_, program, _2) {
        return new Block(program.ast());
    },
    Line(s, _) {
        return s.ast();
    },

    Statement_assignment(access, type, _1, id, _2, elements) {
        return new VariableDeclaration(
            handleAccess(access.ast()),
            type.ast(),
            id.ast(),
            elements.ast(),
        );
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
        return new CallExpression(callee.ast(), [args.ast()]);
    },
    Statement_throw(_1, e) {
        return new ThrowStatement(e.ast());
    },
    Statement_objDec(access, id, _, obj) {
        return new VariableDeclaration(handleAccess(access.ast()), 'object', id.ast(), obj.ast());
    },
    Statement_break(_) {
        return new BreakStatement();
    },

    // prettier-ignore
    If(_1, _2, firstTest, _3, firstBody, _6, _7, moreTests, _8,
        moreBodies, _11, lastBody) {
        const tests = [firstTest.ast(), ...moreTests.ast()];
        const consequents = [firstBody.ast(), ...moreBodies.ast()];
        const alternate = arrayToNullable(lastBody.ast());
        return new GifStatement(tests, consequents, alternate);
    },
    Loop_while(_1, _2, test, _3, suite) {
        return new WhileStatement(test.ast(), suite.ast());
    },
    Function_declaration(_1, id, _2, args, _3, body) {
        return new Func(id.ast(), nonEmpty(args.ast()), body.ast());
    },
    Loop_for(_1, _2, args, _3, test, _4, action, _5, body) {
        return new ForStatement(args.ast(), test.ast(), action.ast(), body.ast());
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
        return new AssignmentStatement(
            left.ast(),
            new BinaryExpression(op.ast().charAt(0), left.ast(), new Literal('whole_number', '1')),
        );
    },
    Exp5_fCall(id, _1, args, _2) {
        return new CallExpression(id.ast(), args.ast());
    },
    Exp5_ArrayExpression(_1, elements, _2) {
        const e = elements.ast();
        const type = new ArrayType(e.length === 0 ? 'temp' : e[0].type);
        return new ArrayExpression(e, new Literal('whole_number', e.length), type);
    },

    id(_1, _2) {
        return this.sourceString;
    },
    relOp(op) {
        if (op.sourceString.length >= 2) {
            return op.sourceString.slice(0, 2);
        }
        return op.sourceString;
    },

    PropAccess_brackets(id, _1, property, _2) {
        return new MemberExpression(id.ast(), property.ast());
    },
    PropAccess_dot(id, _1, property) {
        return new MemberExpression(id.ast(), property.ast());
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
        return new ObjectExp(body.ast(), 'object');
    },

    Type(type, _1, _2) {
        if (_1.ast().length === 0 || _2.ast().length === 0) {
            return type.sourceString;
        }
        return new ArrayType(type.ast());
    },
    intlit(_1, _2) {
        return new Literal('whole_number', this.sourceString);
    },
    declit(_1, _2, _3, _4) {
        return new Literal('not_whole_number', this.sourceString);
    },
    stringlit(_1, chars, _6) {
        return new Literal('array_of_chars', this.sourceString.slice(1, -1));
    },
    null(_) {
        return new Literal('temp', null);
    },
    boolean(v) {
        return new Literal('true_or_false', v.ast());
    },
    _terminal() {
        return this.sourceString;
    },
    VarExp(id) {
        return new IdExp(id.ast());
    },
    Paren_Exp(_1, exp, _2) {
        return exp.ast();
    },

    NonemptyListOf(first, _, rest) {
        return [first.ast(), ...rest.ast()];
    },
    EmptyListOf() {
        return [];
    },
});

module.exports = (text) => {
    const match = grammar.match(text);
    if (!match.succeeded()) {
        throw new Error(`Syntax Error: ${match.message}`);
    }
    return astGenerator(match).ast();
};
