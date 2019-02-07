// module "parser.js"
var ohm = require('ohm-js')
var fs = require('fs')
const grammar = ohm.grammar(fs.readFileSync('./syntax/goof3.ohm'))

module.exports = (text) => {
  const match = grammar.match(text)
  if (!match.succeeded()) {
    console.log(match.message)
  }
  return match.succeeded()
}
