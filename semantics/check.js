const util = require('util');
const { ArrayType, Func } = require('../ast');
const {
    IntType, FloatType, StringType, NullType, BoolType,
} = require('./builtins');

function doCheck(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
module.exports = {
    isArray(expression) {
        doCheck(expression.type instanceof ArrayType, 'Not an array');
    },

    isArrayType(type) {
        doCheck(type instanceof ArrayType, 'Not an array type');
    },

    isInBounds(index, size) {
        doCheck(index >= 0 && index < size, 'ArrayIndexOutOfBoundsException');
    },

    isInteger(expression) {
        doCheck(expression.type === IntType, 'Not an integer');
    },

    isNumber(expression) {
        doCheck(expression.type === IntType || expression.type === FloatType, 'Not a number');
    },

    isBoolean(expression) {
        doCheck(expression.type === BoolType, 'Not a Boolean');
    },

    isString(expression) {
        doCheck(expression.type === StringType, 'Not a string');
    },

    isFunction(value) {
        doCheck(value instanceof Func, 'Not a function');
    },

    // Are two types exactly the same?
    expressionsHaveTheSameType(e1, e2) {
        doCheck(e1.type === e2.type, 'Types must match exactly');
    },

    // Can we assign expression to a variable/param/field of type type?
    isAssignableTo(expression, type) {
        if (expression.type instanceof ArrayType) {
            if (type instanceof ArrayType) {
                this.isAssignableTo(expression.type, type.type);
            } else {
                throw Error(
                    `Expression of type ${util.format(
                        expression.type,
                    )} not compatible with type ${util.format(type)}`,
                );
            }
        } else if (expression.type === IntType && type === FloatType) {
            // eslint-disable-next-line no-param-reassign
            expression.type = FloatType; // Ints can be floats
        } else {
            doCheck(
                expression.type === NullType || expression.type === type,
                `Expression of type ${util.format(
                    expression.type,
                )} not compatible with type ${util.format(type)}`,
            );
        }
    },

    isNotReadOnly(variable) {
        doCheck(variable.access !== 'CONSTANT_VARIABLE', 'Assignment to read-only variable');
    },

    isAssignment(expression) {
        doCheck(expression.constructor.name === 'AssignmentStatement', 'Not an assignment');
    },

    // Same number of args and params; all types compatible
    legalArguments(args, params) {
        doCheck(
            args.length === params.length,
            `Expected ${params.length} args in call, got ${args.length}`,
        );
        args.forEach((arg, i) => this.isAssignableTo(arg, params[i].type));
    },
};
