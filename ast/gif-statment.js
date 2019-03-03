module.exports = class GifStatement {
    constructor (tests, consequents, alternate) {
        Object.assign(this, { tests, consequents, alternate });
    }
};
