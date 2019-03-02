module.exports = class VariableDeclaration {
    // During syntax analysis (parsing), all we do is collect the variable names.
    // We will make the variable objects later, because we have to add them to a
    // semantic analysis context.
    constructor (ids, initializers) {
        Object.assign(this, { ids, initializers });
    }
};
