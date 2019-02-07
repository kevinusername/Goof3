/* eslint-disable node/no-deprecated-api */
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
var assert = require('assert')
const ohm = require('ohm-js')
const fs = require('fs')

const grammar = ohm.grammar(fs.readFileSync('./syntax/goof3.ohm'))

describe('The grammar', () => {
  fs.readdirSync('./examples/').forEach(name => {
    if (name.endsWith('.goof')) {
      it(`matches the program ${name}`, done => {
        fs.readFile(`./examples/${name}`, 'utf-8', (err, input) => {
          // In this test we just care that it parses without errors
          assert.equal(grammar.match(input).succeeded(), true)
          done()
        })
      })
    } else if (name.endsWith('.error')) {
      it(`detects a syntax error in ${name}`, done => {
        fs.readFile(`${__dirname}/${name}`, 'utf-8', (err, input) => {
          // We always wrap Ohm failures in an error with text "Syntax Error"
          assert.throws(() => parse(input), /Syntax Error/)
          done()
        })
      })
    }
  })
})
