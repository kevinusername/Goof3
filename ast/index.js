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

class CallExpression {
    constructor(callee, args) {
        Object.assign(this, { callee, args });
    }
}

class Field {
    constructor(type, key, value) {
        Object.assign(this, { type, key, value });
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
        this.key = f.id;
        delete this.id;
    }
}

class ObjectExp {
    constructor(p) {
        Object.assign(this, { Properties: Object.values(p) });
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
    constructor(e) {
        Object.assign(this, { e });
    }
}

class VariableDeclaration {
    constructor(access, type, id, initializers) {
        Object.assign(this, { access, type, id, initializers });
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
    PrimitiveType,
    ReturnStatement,
    ThrowStatement,
    VariableDeclaration,
    WhileStatement,
};
