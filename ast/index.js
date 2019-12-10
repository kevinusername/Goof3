/* eslint-disable max-classes-per-file */
class ArrayExpression {
    constructor(elements, size, type) {
        Object.assign(this, { elements, size, type });
    }
}

class ArrayType {
    constructor(t) {
        Object.assign(this, { type: t });
    }
}

class AssignmentStatement {
    constructor(target, source) {
        Object.assign(this, { target, source });
    }
}

class BinaryExpression {
    constructor(op, left, right) {
        Object.assign(this, { op, left, right });
    }
}

class Block {
    constructor(statements) {
        this.statements = statements;
    }
}

class BreakStatement {}

class CallExpression {
    constructor(callee, args) {
        Object.assign(this, { callee, args });
    }
}

class Field {
    constructor(type, id, value) {
        Object.assign(this, { type, id, value });
    }
}

class ForStatement {
    constructor(assignments, test, action, body) {
        Object.assign(this, { assignments, test, action, body });
    }
}

class Func {
    constructor(id, parameters, body) {
        Object.assign(this, { id, parameters, body });
    }
}

class GifStatement {
    constructor(tests, consequents, alternate) {
        Object.assign(this, { tests, consequents, alternate });
    }
}

class IdExp {
    constructor(reference) {
        Object.assign(this, { reference });
    }
}

class Ignore {}

class Literal {
    constructor(type, value) {
        Object.assign(this, { type, value });
    }
}

class MemberExpression {
    constructor(object, property) {
        Object.assign(this, { object, property });
    }
}

class Method {
    constructor(f) {
        Object.assign(this, { ...f });
    }
}

class ObjectExp {
    constructor(p, type) {
        Object.assign(this, { properties: Object.values(p), type });
    }
}

class Parameter {
    constructor(type, id) {
        Object.assign(this, { type, id });
    }
}

class PrimitiveType {
    constructor(type) {
        Object.assign(this, { type });
    }
}

class ReturnStatement {
    constructor(returnValue) {
        this.returnValue = returnValue;
    }
}

class ThrowStatement {
    constructor(error) {
        Object.assign(this, { error });
    }
}

class VariableDeclaration {
    constructor(access, type, id, initializer) {
        Object.assign(this, { access, type, id, initializer });
    }
}

class WhileStatement {
    constructor(test, body) {
        Object.assign(this, { test, body });
    }
}

module.exports = {
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
    Ignore,
    Literal,
    MemberExpression,
    Method,
    ObjectExp,
    Parameter,
    PrimitiveType,
    ReturnStatement,
    ThrowStatement,
    VariableDeclaration,
    WhileStatement,
};
