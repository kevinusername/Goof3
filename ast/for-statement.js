module.exports = class ForStatement {
    constructor (assignments, test, action, body) {
        Object.assign(this, { assignments, test, action, body });
    }
};
