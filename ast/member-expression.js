module.exports = class MemberExpression {
    constructor (object, property) {
        Object.assign(this, { object, property });
    }
};
