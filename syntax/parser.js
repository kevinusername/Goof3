// module "parser.js"
var ohm = require('ohm-js')
var fs = require('fs')
const grammar = ohm.grammar(fs.readFileSync('./syntax/goof3.ohm'))

module.exports = (text) => {
  return grammar.match(text).succeeded()
}
