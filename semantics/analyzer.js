const {
    ArrayExpression,
    ArrayType,
    AssignmentStatement,
    BinaryExpression,
    CallExpression,
    Field,
    ForStatement,
    Func,
    GifStatement,
    Literal,
    MemberExpression,
    Method,
    ObjectExp,
    Parameter,
    VariableDeclaration,
    IdExp,
    WhileStatement,
} = require('../ast');

const {
    IntType, FloatType, StringType, NullType, BoolType,
} = require('./builtins');

function getType(typeString) {
    switch (typeString) {
    case 'array_of_chars':
        return StringType;
    case 'whole_number':
        return IntType;
    case 'not_whole_number':
        return FloatType;
    case 'true_or_false':
        return BoolType;
    case 'temp':
        return NullType;
    default:
        throw Error('Invalid type');
    }
}

const check = require('./check');

ArrayExpression.prototype.analyze = function () {
    this.type.analyze();
    check.isArray(this);
    this.size.analyze();
    check.isInteger(this.size);
    this.elements.forEach((e) => {
        e.analyze();
        check.isAssignableTo(e, this.type.type);
    });
};

ArrayType.prototype.analyze = function () {
    check.isArrayType(this);
    this.type = getType(this.type);
};

AssignmentStatement.prototype.analyze = function (context) {
    this.source.analyze(context);
    this.target.analyze(context);
    check.isAssignableTo(this.source, this.target.type);
    check.isNotReadOnly(this.target);
};

BinaryExpression.prototype.analyze = function (context) {
    this.left.analyze(context);
    this.right.analyze(context);
    if (/[-+*/]/.test(this.op)) {
        check.isNumber(this.left);
        check.isNumber(this.right);
        if (this.left.type === FloatType || this.right.type === FloatType) {
            this.type = FloatType;
        } else this.type = IntType;
    } else if (/[<>]/.test(this.op)) {
        check.isNumber(this.left);
        check.isNumber(this.right);
        this.type = BoolType;
    } else if (/\|\||&&/.test(this.op)) {
        check.isBoolean(this.left);
        check.isBoolean(this.right);
        this.type = BoolType;
    } else if (/^[!=]/.test(this.op)) {
        check.expressionsHaveTheSameType(this.left, this.right);
        this.type = BoolType;
    }
};

CallExpression.prototype.analyze = function (context) {
    this.callee = context.lookupValue(this.callee);
    check.isFunction(this.callee, 'Attempt to call a non-function');
    this.args.forEach(arg => arg.analyze(context));
    check.legalArguments(this.args, this.callee.parameters);
    // this.type = this.callee.returnType;
};

Field.prototype.analyze = function (context) {
    this.type = getType(this.type);
    this.value.analyze();
};

ForStatement.prototype.analyze = function (context) {
    const loopContext = context.createChildContextForLoop();
    this.assignments.forEach(e => e.analyze(loopContext));
    this.test.analyze(loopContext);
    check.isBoolean(this.test);
    this.action.analyze(loopContext);
    check.isAssignment(this.action);
    this.body.forEach(e => e.analyze(loopContext));
};

Func.prototype.analyzeSignature = function (context) {
    this.bodyContext = context.createChildContextForFunctionBody(this);
    this.parameters.forEach(p => p.analyze(this.bodyContext));
    context.add(this);
};

Func.prototype.analyze = function (context) {
    this.analyzeSignature(context);
    this.body.forEach(e => e.analyze(this.bodyContext));
};

GifStatement.prototype.analyze = function (context) {
    this.tests.forEach((e) => {
        e.analyze(context);
        check.isBoolean(e);
    });
    this.consequents.forEach(cons => cons.forEach(e => e.analyze(context)));
    if (this.alternate) {
        this.alternate[0].analyze(context);
    }
};

Literal.prototype.analyze = function () {
    this.type = getType(this.type);
};

MemberExpression.prototype.analyze = function (context) {
    this.object.analyze(context);
    this.property.analyze(context);
    if (this.object.reference.type instanceof ArrayType) {
        check.isInteger(this.property);
    } else if (this.object.reference.type instanceof ObjectExp) {
        check.isString(this.property);
    } else {
        throw Error('Non subscriptable expression');
    }
};

Method.prototype.analyze = function (context) {};

ObjectExp.prototype.analyze = function (context) {};

Parameter.prototype.analyze = function (context) {
    this.type = getType(this.type);
    context.add(this);
};

VariableDeclaration.prototype.analyze = function (context) {
    this.initializer.analyze(context);
    if (this.type instanceof ArrayType) this.type.analyze();
    else this.type = getType(this.type);
    check.isAssignableTo(this.initializer, this.type);
    context.add(this);
};

IdExp.prototype.analyze = function (context) {
    this.reference = context.lookupValue(this.reference);
    this.type = this.reference.type;
};

WhileStatement.prototype.analyze = function (context) {
    const loopContext = context.createChildContextForLoop();
    this.test.analyze(loopContext);
    check.isBoolean(this.test);
    this.body.forEach(e => e.analyze(loopContext));
};
