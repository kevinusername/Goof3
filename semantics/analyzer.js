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
    ReturnStatement,
    ThrowStatement,
    VariableDeclaration,
    WhileStatement,
} = require('../ast');

const {
    IntType, FloatType, StringType, NullType, BoolType,
} = require('./builtins');

const check = require('./check');

ArrayExpression.prototype.analyze = function () {
    check.isArray(this);
    this.type.analyze();
    this.size.analyze();
    // check.isInteger(this.size);
    this.elements.forEach((e) => {
        e.analyze();
        check.isAssignableTo(e, this.type.type);
    });
};

ArrayType.prototype.analyze = function () {
    check.isArrayType(this.type);
    this.type.analyze();
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
    check.isNumber(this.left);
    check.isNumber(this.right);
    if (this.left.type === FloatType || this.right.type === FloatType) {
        this.type = FloatType;
    } else this.type = IntType;
};

CallExpression.prototype.analyze = function (context) {
    this.callee = context.lookupValue(this.callee);
    check.isFunction(this.callee, 'Attempt to call a non-function');
    this.args.forEach(arg => arg.analyze(context));
    check.legalArguments(this.args, this.callee.params);
    this.type = this.callee.returnType;
};

Field.prototype.analyze = function (context) {
    // this.type = context.lookupType(this.type);
};

ForStatement.prototype.analyze = function (context) {
    this.low.analyze(context);
    check.isInteger(this.low, 'Low bound in for');
    this.high.analyze(context);
    check.isInteger(this.high, 'High bound in for');
    const bodyContext = context.createChildContextForLoop();
    this.index = new Variable(this.index, this.low.type);
    this.index.readOnly = true;
    bodyContext.add(this.index);
    this.body.analyze(bodyContext);
    // currently the same as tiger
};

Func.prototype.analyze = function (context) {};

GifStatement.prototype.analyze = function (context) {
    this.tests.analyze(context);
    check.isInteger(this.tests, 'Test in if');
    this.consequents.analyze(context);
    if (this.alternate) {
        this.alternate.analyze(context);
    }
};

Literal.prototype.analyze = function () {
    switch (this.type) {
    case 'string':
        this.type = StringType;
        break;
    case 'int':
        this.type = IntType;
        break;
    case 'float':
        this.type = FloatType;
        break;
    case 'boolean':
        this.type = BoolType;
        break;
    case 'null':
        this.type = NullType;
        break;
    default:
        throw Error('Invalid type');
    }
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
    context.add(this);
};

ReturnStatement.prototype.analyze = function (context) {};

ThrowStatement.prototype.analyze = function (context) {};

VariableDeclaration.prototype.analyze = function (context) {
    this.init.analyze(context);
    check.isAssignableTo(this.init, this.type);
    context.add(this);
};

WhileStatement.prototype.analyze = function (context) {
    this.test.analyze(context);
};
