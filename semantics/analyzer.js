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
} = require('../ast');

const Context = require('./context');

const {
    IntType, FloatType, StringType, NullType, BoolType,
} = require('./builtins');

module.exports = function (exp) {
    exp.analyze(Context.INITIAL);
};

function getType(typeString) {
    // if (typeString instanceof ArrayType) {
    //     return new ArrayType(getType(typeString.type));
    // }
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
        // Case: object. Will never need a default case since it is a syntax error
        // However, JS needs a default statement, so it is just the last case
        return typeString;
    }
}

const check = require('./check');

ArrayExpression.prototype.analyze = function () {
    this.type.analyze();
    check.isArray(this);
    this.size.analyze();
    check.isInteger(this.size);
    for (let i = 0; i < this.elements.length; i += 1) {
        const e = this.elements[i];
        e.analyze();
        /* If a float exists in a list that is otherwise ints,
         convert the array type to float and all ints to floats */
        if (this.type.type === IntType && e.type === FloatType) {
            this.type.type = FloatType;
            i = -1;
            continue;
        } else if (this.type.type === FloatType && e.type === IntType) {
            e.type = FloatType;
        }
        check.isAssignableTo(e, this.type.type);
    }
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

Block.prototype.analyze = function (context) {
    if (Array.isArray(this.statements)) this.statements.forEach((s) => s.analyze(context));
    else if (this.statements) this.statements.analyze(context);
};

BreakStatement.prototype.analyze = function (context) {
    if (!context.inLoop) throw Error('Break statement used out of loop');
};

CallExpression.prototype.analyze = function (context) {
    this.callee = context.lookupValue(this.callee);
    check.isFunction(this.callee, 'Attempt to call a non-function');
    this.args.forEach((arg) => arg.analyze(context));
    check.legalArguments(this.args, this.callee.parameters);
};

Field.prototype.analyze = function (context) {
    this.type = getType(this.type);
    this.value.analyze(context);
    check.isAssignableTo(this.value, this.type);
    context.add(this);
};

ForStatement.prototype.analyze = function (context) {
    const loopContext = context.createChildContextForLoop();
    this.assignments.forEach((e) => e.analyze(loopContext));
    this.test.analyze(loopContext);
    check.isBoolean(this.test);
    this.action.analyze(loopContext);
    check.isAssignment(this.action);
    this.body.analyze(loopContext);
};

Func.prototype.analyzeSignature = function (context) {
    this.bodyContext = context.createChildContextForFunctionBody(this);
    if (this.parameters) {
        this.parameters.forEach((p) => p.analyze(this.bodyContext));
    }
    context.add(this);
};

Func.prototype.analyze = function (context) {
    this.analyzeSignature(context);
    if (this.body) this.body.analyze(this.bodyContext);
};

GifStatement.prototype.analyze = function (context) {
    this.tests.forEach((e) => {
        e.analyze(context);
        check.isBoolean(e);
    });
    this.consequents.forEach((cons) => cons.analyze(context));
    if (this.alternate) this.alternate.analyze(context);
};

IdExp.prototype.analyze = function (context) {
    this.reference = context.lookupValue(this.reference);
    this.type = this.reference.type;
};

Literal.prototype.analyze = function () {
    this.type = getType(this.type);
};

MemberExpression.prototype.analyze = function (context) {
    this.object.analyze(context);
    if (this.object.reference.type instanceof ArrayType) {
        this.accessType = 'array';
        this.property.analyze(context);
        this.type = this.property.type;
        check.isInteger(this.property);
        check.isInBounds(this.property.value, this.object.reference.initializer.size.value);
    } else if (this.object.reference.type === 'object') {
        this.accessType = 'object';
        this.property = new IdExp(this.property);
        this.property.analyze(this.object.reference.initializer.ObjContext);
        this.type = this.property.type;
    } else {
        throw Error('Non subscriptable expression');
    }
};

Method.prototype.analyzeSignature = function (context) {
    this.bodyContext = context.createChildContextForFunctionBody(this);
    if (this.parameters) this.parameters.forEach((p) => p.analyze(this.bodyContext));
    context.add(this);
};

Method.prototype.analyze = function (context) {
    this.analyzeSignature(context);
    if (this.body) this.body.analyze(this.bodyContext);
};

ObjectExp.prototype.analyze = function (context) {
    this.ObjContext = context.createChildContextForObject();
    this.properties.forEach((p) => p.analyze(this.ObjContext));
};

Parameter.prototype.analyze = function (context) {
    this.type = getType(this.type);
    context.add(this);
};

ReturnStatement.prototype.analyze = function (context) {
    this.returnValue.analyze(context);
};

ThrowStatement.prototype.analyze = function () {
    this.error.analyze();
    check.isString(this.error);
};

VariableDeclaration.prototype.analyze = function (context) {
    if (this.type instanceof ArrayType) {
        this.type.analyze();
    } else {
        this.type = getType(this.type);
    }
    if (this.initializer) {
        this.initializer.analyze(context);
        check.isAssignableTo(this.initializer, this.type);
    }
    context.add(this);
};

WhileStatement.prototype.analyze = function (context) {
    const loopContext = context.createChildContextForLoop();
    this.test.analyze(loopContext);
    check.isBoolean(this.test);
    this.body.analyze(loopContext);
};
