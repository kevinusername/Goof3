/*
 * Semantic Analysis Context
 *
 * A context object holds state for the semantic analysis phase.
 *
 *   const Context = require('./semantics/context');
 */

const { standardFunctions } = require('./builtins');

require('./analyzer');

class Context {
    constructor({ parent = null, currentFunction = null, inLoop = false } = {}) {
        Object.assign(this, {
            parent,
            currentFunction,
            inLoop,
            valueMap: Object.create(null),
        });
    }

    createChildContextForFunctionBody(currentFunction) {
        // When entering a new function, we're not in a loop anymore
        return new Context({ parent: this, currentFunction, inLoop: false });
    }

    createChildContextForLoop() {
        // When entering a loop body, just set the inLoop field, retain others
        return new Context({ parent: this, currentFunction: this.currentFunction, inLoop: true });
    }

    createChildContextForObject() {
        return new Context({ parent: this, currentFunction: this.currentFunction, inLoop: false });
    }

    // Adds a variable or function to this context.
    add(entity) {
        if (entity.id in this.valueMap) {
            this.valueMap[entity.id].push(entity);
        } else {
            this.valueMap[entity.id] = [entity];
        }
    }

    // Returns the variable or function entity bound to the given identifier,
    // starting from this context and searching "outward" through enclosing
    // contexts if necessary.
    lookupValue(id) {
        for (let context = this; context !== null; context = context.parent) {
            if (id in context.valueMap) {
                return context.valueMap[id][
                    Math.floor(Math.random() * context.valueMap[id].length)
                ];
            }
        }
        throw new Error(`${id} has not been declared`);
    }

    createInitial() {
        standardFunctions.forEach((f) => {
            this.valueMap[f.id] = [f];
        });
    }
}

module.exports = Context;
