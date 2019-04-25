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
    WhileStatement,
} = require('../ast');

const {
    IntType, FloatType, StringType, NullType, BoolType,
} = require('./builtins');

function getType(typeString) {
    switch (typeString) {
    case 'string':
        return StringType;
    case 'int':
        return IntType;
    case 'float':
        return FloatType;
    case 'boolean':
        return BoolType;
    case 'null':
        return NullType;
    default:
        throw Error('Invalid type');
    }
}

const check = require('./check');

ArrayExpression.prototype.analyze = function () {
    check.isArray(this);
    this.type.analyze();
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
    check.legalArguments(this.args, this.callee.params);
    // this.type = this.callee.returnType;
};

Field.prototype.analyze = function (context) {
    this.type = getType(this.type);
    this.value.analyze();
};

ForStatement.prototype.analyze = function (context) {
    const loopContext = context.createChildContextForLoop();
    this.assignments.analyze(loopContext);
    this.test.analyze(loopContext);
    check.isBoolean(test);
    this.action.analyze(loopContext);
    check.isAssignment(this.action);
    this.body.analyze(loopContext);
};

Func.prototype.analyzeSignature = function (context) {
    this.bodyContext = context.createChildContextForFunctionBody();
    this.params.forEach(p => p.analyze(this.bodyContext));
    // this.returnType = context.lookupType(this.returnType);
};

Func.prototype.analyze = function () {
    this.body.analyze(this.bodyContext);
    // check.isAssignableTo(this.body, this.returnType, 'Type mismatch in function return');
};

GifStatement.prototype.analyze = function (context) {
    this.tests.analyze(context);
    check.isInteger(this.tests, 'Test in if');
    this.consequents.analyze(context);
    if (this.alternate) {
        this.alternate.analyze(context);
    }
};

Literal.prototype.analyze = function () {
    this.type = getType(this.type);
};

MemberExpression.prototype.analyze = function (context) {
    this.record.analyze(context);
    check.isRecord(this.record);
    const field = this.record.type.getFieldForId(this.id);
    this.type = field.type;
};

Method.prototype.analyze = function (context) {};

ObjectExp.prototype.analyze = function (context) {};

Parameter.prototype.analyze = function (context) {
    this.type = getType(this.type);
    context.add(this);
};

// ReturnStatement.prototype.analyze = function (context) {};

// ThrowStatement.prototype.analyze = function (context) {};

VariableDeclaration.prototype.analyze = function (context) {
    this.initializer.analyze(context);
    if (this.type instanceof ArrayType) this.type.analyze();
    else this.type = getType(this.type);
    check.isAssignableTo(this.init, this.type);
    context.add(this);
};

WhileStatement.prototype.analyze = function (context) {
    this.test.analyze(context);
};
