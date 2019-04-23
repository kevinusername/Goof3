const { Func, Parameter, Literal } = require('../ast');

const IntType = new Literal('whole_number');
const FloatType = new Literal('not_whole_number');
const StringType = new Literal('array_of_chars');
const NullType = new Literal('temp');

const standardFunctions = [new Func('poof', [new Parameter('s', StringType)])];

module.exports = {
    IntType,
    StringType,
    NullType,
    FloatType,
    standardFunctions,
};
