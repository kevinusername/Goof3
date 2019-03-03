module.exports = class FunctionObject {
    constructor (id, params, body) {
        Object.assign(this, { id, params, body });
    }
};
