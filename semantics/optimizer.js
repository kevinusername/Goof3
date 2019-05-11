const {
    ArrayExpression,
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
    ReturnStatement,
    ThrowStatement,
    VariableDeclaration,
    WhileStatement,
} = require('../ast');

function isZero(e) {
    return e instanceof Literal && e.value === '0';
}

function isOne(e) {
    return e instanceof Literal && e.value === '1';
}

function bothLiterals(b) {
    return b.left instanceof Literal && b.right instanceof Literal;
}

function isFalse(item) {
    return item instanceof Literal && item.value === 'foof';
}

function isTrue(item) {
    return item instanceof Literal && item.value === 'toof';
}

ArrayExpression.prototype.optimize = function () {
    this.elements = this.elements.map(e => e.optimize());
    this.size = this.size.optimize();
    return this;
};

AssignmentStatement.prototype.optimize = function () {
    this.target = this.target.optimize();
    this.source = this.source.optimize();
    // Dont need to assign something to itself
    if (this.target instanceof IdExp && this.source instanceof IdExp) {
        if (this.target.reference === this.source.reference) return new Ignore();
    }
    return this;
};

BinaryExpression.prototype.optimize = function () {
    this.left = this.left.optimize();
    this.right = this.right.optimize();
    const leftType = this.left.type.type;
    const rightType = this.right.type.type;
    if (this.op === '+' && isZero(this.right)) return this.left;
    if (this.op === '+' && isZero(this.left)) return this.right;
    if (this.op === '*' && isZero(this.right)) return new Literal(leftType, '0');
    if (this.op === '*' && isZero(this.left)) return new Literal(rightType, '0');
    if (this.op === '*' && isOne(this.right)) return this.left;
    if (this.op === '*' && isOne(this.left)) return this.right;

    if (this.op === '||' && isFalse(this.right)) return this.left;
    if (this.op === '||' && isFalse(this.left)) return this.right;
    if (this.op === '||' && isTrue(this.right)) return this.right;
    if (this.op === '||' && isTrue(this.left)) return this.left;

    if (this.op === '&&' && (isFalse(this.right) || isFalse(this.left))) {
        return new Literal('true_or_false', 'foof');
    }

    if (bothLiterals(this)) {
        const [x, y] = [this.left.value, this.right.value];
        let resultType = 'whole_number';
        if (leftType === 'not_whole_number' || rightType === 'not_whole_number') {
            resultType = 'not_whole_number';
        }
        if (this.op === '+') return new Literal(resultType, x + y);
        if (this.op === '*') return new Literal(resultType, x * y);
        if (this.op === '/') return new Literal(resultType, x / y);
        if (/[<>]/.test(this.op)) {
            // eslint-disable-next-line no-eval
            return new Literal('true_or_false', eval(`${x} ${this.op} ${y}`) ? 'toof' : 'foof');
        }
        if (/(==)|(^=$)/.test(this.op) && x === y) return new Literal('true_or_false', 'toof');
        if (this.op === '!=' && x !== y) return new Literal('true_or_false', 'foof');
    }
    return this;
};

Block.prototype.optimize = function () {
    if (Array.isArray(this.statements)) {
        this.statements = this.statements.map(s => s.optimize());
    } else if (this.statements) {
        this.statements = this.statements.optimize();
    }
    return this;
};

BreakStatement.prototype.optimize = function () {
    return this;
};

CallExpression.prototype.optimize = function () {
    this.args = this.args.map(a => a.optimize());
    this.callee = this.callee.optimize();
    return this;
};

Field.prototype.optimize = function () {
    this.value = this.value.optimize();
    return this;
};

ForStatement.prototype.optimize = function () {
    this.assignments = this.assignments.map(e => e.optimize());
    this.test = this.test.optimize();
    this.action = this.action.optimize();
    this.body = this.body.optimize();
    return this;
};

Func.prototype.optimize = function () {
    if (this.body) this.body = this.body.optimize();
    return this;
};

GifStatement.prototype.optimize = function () {
    this.tests = this.tests.map(e => e.optimize());
    let toRemove = [];
    // Find cases that are always False
    this.tests.forEach((item, i) => {
        if (isFalse(item)) {
            toRemove.push(i);
        }
    });
    // Remove cases where the test will never happen
    toRemove.forEach((i) => {
        this.tests.splice(i, 1);
        this.consequents.splice(i, 1);
    });

    this.consequents = this.consequents.map(cons => cons.optimize());
    toRemove = [];
    // Find empty bodies
    this.consequents.forEach((body, i) => {
        if (!body.statements.statements) {
            toRemove.push(i);
        }
    });
    // Remove cases with empty bodies
    toRemove.forEach((i) => {
        this.tests.splice(i, 1);
        this.consequents.splice(i, 1);
    });

    if (this.alternate) {
        this.alternate = this.alternate.optimize();
        // Remove empty else {} statement
        if (!this.alternate.statements.statements) this.alternate = null;
    }

    if (this.tests.length === 0) return new Ignore();
    return this;
};

IdExp.prototype.optimize = function () {
    return this;
};

Literal.prototype.optimize = function () {
    return this;
};

MemberExpression.prototype.optimize = function () {
    return this;
};

Method.prototype.optimize = function () {
    if (this.body) this.body = this.body.optimize();
    return this;
};

ObjectExp.prototype.optimize = function () {
    this.properties = this.properties.map(p => p.optimize());
    return this;
};

Parameter.prototype.optimize = function () {
    return this;
};

ReturnStatement.prototype.optimize = function () {
    this.returnValue = this.returnValue.optimize();
    return this;
};

ThrowStatement.prototype.optimize = function () {
    return this;
};

VariableDeclaration.prototype.optimize = function () {
    this.initializer = this.initializer.optimize();
    return this;
};

WhileStatement.prototype.optimize = function () {
    this.test = this.test.optimize();
    if (this.test instanceof Literal && this.test.value === 'foof') {
        // Just generate the empty string, block will never happen
        return new Ignore();
    }
    this.body = this.body.optimize();
    if (!this.body.statements.statements) return new Ignore();
    return this;
};
