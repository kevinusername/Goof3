const ohm = require('ohm-js')
const fs = require('fs')

const grammar = ohm.grammar(fs.readFileSync('./syntax/goof3.ohm'))

console.log(grammar.match('poof("hELlO woRlD!"):').succeeded())
console.log(
  grammar
    .match(
      `if ( 1 < 4 ===== toof) }
return "troof":
{`
    )
    .succeeded()
)

console.log(
  grammar
    .match(
      `phoof myFunction(p1, p2) }
return p1 * p2:
{`
    )
    .succeeded()
)

console.log(grammar.match(`goof letsGainThisGrain ==== 20.25:`).succeeded())

console.log(
  grammar
    .match(
      `xD This is a single line comment in Goof3

      ;) This is a multine
      comment in Goof3 (;`
    )
    .succeeded()
)

console.log(
  grammar
    .match(
      `yeet "OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!":`
    )
    .succeeded()
)

console.log(
  grammar
    .match(
      `phoof fib ( n) }
if (n <= 1) }
    return n:
{
xD hey there
return fib (n - 2) + fib(n -1):
{

for (goof i ==== 11: i <  size - 11: i++) }
goof dog == 10:
;) heres a
multiline
for you (;
return "wHYyyYYyYy":
{`
    )
    .succeeded()
)

console.log(grammar.match(`this isnt in the language`).failed())
