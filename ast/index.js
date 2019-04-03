class ArrayExpression {
    constructor (elements) {
        Object.assign(this, { elements });
    }
}

class AssignmentStatement {
    constructor (targets, sources) {
        Object.assign(this, { targets, sources });
    }
}

class BinaryExpression {
    constructor (op, left, right) {
        Object.assign(this, { op, left, right });
    }
}

class CallExpression {
    constructor (callee, args) {
        Object.assign(this, { callee, args });
    }
}

class ForStatement {
    constructor (assignments, test, action, body) {
        Object.assign(this, { assignments, test, action, body });
    }
}

class FunctionObject {
    constructor (id, params, body) {
        Object.assign(this, { id, params, body });
    }
}

class FunctionDeclaration {
    constructor (id, params, body) {
        this.id = id;
        this.function = new FunctionObject(id, params, body);
    }
}

class GifStatement {
    constructor (tests, consequents, alternate) {
        Object.assign(this, { tests, consequents, alternate });
    }
}

class Identifier {
    constructor (name) {
        Object.assign(this, { name });
    }
}

class MemberExpression {
    constructor (object, property) {
        Object.assign(this, { object, property });
    }
}

class NumericLiteral {
    constructor (value) {
        this.value = value;
    }
}

class ReturnStatement {
    constructor (returnValue) {
        this.returnValue = returnValue;
    }
}

class StringLiteral {
    constructor (value) {
        this.value = value;
    }
}

class ThrowStatement {
    constructor (e) {
        Object.assign(this, { e });
    }
}

class VariableDeclaration {
    constructor (ids, initializers) {
        Object.assign(this, { ids, initializers });
    }
}

class Variable {
    constructor (id) {
        this.id = id;
    }
}

class WhileStatement {
    constructor (test, body) {
        Object.assign(this, { test, body });
    }
}

module.exports = {
    ArrayExpression,
    AssignmentStatement,
    BinaryExpression,
    CallExpression,
    ForStatement,
    FunctionObject,
    FunctionDeclaration,
    GifStatement,
    Identifier,
    MemberExpression,
    NumericLiteral,
    ReturnStatement,
    StringLiteral,
    ThrowStatement,
    VariableDeclaration,
    Variable,
    WhileStatement
};