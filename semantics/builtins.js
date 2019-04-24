const { Func, Parameter, PrimitiveType } = require('../ast');

const IntType = new PrimitiveType('whole_number');
const FloatType = new PrimitiveType('not_whole_number');
const StringType = new PrimitiveType('array_of_chars');
const NullType = new PrimitiveType('temp');

const standardFunctions = [new Func('poof', [new Parameter('s', StringType)])];

module.exports = {
    IntType,
    StringType,
    NullType,
    FloatType,
    standardFunctions,
};
