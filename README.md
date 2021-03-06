# Goof3

![Logo](Goof3_Logo.png)

#### Blake Crowther, Nikky Rajavasireddy, Andrew Arteaga, Kevin Peters, Michael Simmons, Michael West

## Short Description

Have languages like Python made programming "too easy?" Well Goof3 is here to make it less easy! Goof3 is an improvement over the underappreciated and underdeveloped Goof2 language, which itself sought to improve upon its predecessor, Goof. Goof3 is the goofiest of programming languages. Parts of it make little to no sense, other parts of it make all of the sense possible. It is virtually impossible to sum up Goof3 in a mere sentence, but if one had to do so, Goof3 is the future of programming languages. It is all of the fun of JavaScript, but with all-around more goofiness.

The best part, you may wonder? Well, have you ever compiled and run your code, and it didn't work? And instead of changing anything, you decided to compile and run it again, hoping for a different outcome while at the same time knowing you won't get one? With Goof3, it actually is possible to expect a different outcome (by way of how we handle the redeclaration of variables)!

## List of Features

- Declare functions with "phoof".
- True is now "toof" and false is now "foof".
- Declare print statements with "poof".
- Static Typing, Static Scoping.
- Semicolons are colons, and colons are semicolons.
- Closure begins with ";}" and ends with ";{".
- Exceptions are thrown with witty and loosely-related error messages.
- Single-line comments must start with "XD".
- Multi-line comments must start with ";)" and end with "(;".
- Compare with an odd number of "=" signs, set values with an even number of "=" signs.
- High-order functions
- Declare while loops with "wooloop".
<br>... AND NOW WITH NEW FEATURES SUCH AS
- Objects declared with #
- Properties declared with ~
- Required explicit typing with @
- The essential primitives "whole_number" | "true_or_false" | "array_of_chars" | "not_whole_number"
- Access modifiers : "CONSTANT_VARIABLE" | "LOCAL_VARIABLE" | "GLOBAL_VARIABLE"
- All braces are now winky faces ;} ;{
- return statements must now use yeet
<br>... AND MORE! NEVER UNDERESTIMATE tHe GOoF!

## List of Semantic Checks

- use of undeclared variable
- non boolean test condition
- non integer in add/subtract/multiply/divide
- types do not match in equality test
- types do not match in inequality test
- types do not match in logical test
- types do not match in declaration
- types do not match in reassignment
- non-Integers in comparison
- call of non-method/function
- too many/few function arguments
- wrong type of function argument
- non-existent field access
- non-Integer array index
- subscript of non-array: braces
- subscript of non-object: dot
- non integer subscript
- print/throw non-string
- unitialized variable when using sufix operator
- incrementing non-Integers
- comparing strings
- ArrayIndexOutOfBoundsException
- all list elements not of same type
- non-assignments in four loop "action"

## Example Programs

Here are some examples, Goof3 on the left, JavaScript on the right.

### "Hello World" Example

- Declare print statements with "poof"

<table>
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
poof("hELlO woRlD!"):
```

  </td>

  <td>

```javascript
console.log('hELlO woRlD!')
```

  </td>

  </tr>
</table>

### Function Example

- Declare functions with "phoof".
- Use colon instead of semicolon.
- Reverse curly braces for closure.

<table>
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
phoof myFunction(whole_number @ p1, whole_number @ p2) ;}
  yeet p1 * p2:
;{
```

  </td>

  <td>

```javascript
function myFunction(p1, p2) {
  return p1 * p2
}
```

  </td>

  </tr>
</table>

### Declaration Example

- No more ints, strings, doubles, longs, or floats
- Now declare using the one of keywords "whole_number" | "true_or_false" | "array_of_chars" | "not_whole_number" followed by @
- Camel-case
- Set values with even number of "=" signs

<table>
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
not_whole_number @ letsGainThisGrain ==== 20.25:
whole_number @ myAge ====== 21:
true_or_false @ kevinsAStud == toof:
array_of_chars @ simmons ======== "Lumberjack":
```

  </td>

  <td>

```javascript
var money = 20.25;
var age = 21;
var kevin = true;
var simmons = "Lumberjack";
```
  </td>
  </tr>
</table>


### Comparison Example

- Compare values with odd number of "=" signs

<table>
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
gif ( 1 < 4 ===== toof) ;}
  yeet "troof":
;{
```

  </td>

  <td>

```javascript
if (1 < 4 == true) {
  return "That's the truth";
}
```

  </td>

  </tr>
</table>

### Comment Example

- Single line comments must start with xD
- Multiline comments must start with ;) and end with (;

<table>
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
xD This is a single line comment in Goof3

;) This is a multiline
comment in Goof3 (;
```

  </td>

  <td>

```javascript
// This is a single line comment in JavaScript

/* This is a multiline
comment in javascript */
```

  </td>

  </tr>
</table>

### Throw Error Example

- Exceptions are thrown with witty and loosely-related error messages.

<table style="table-layout: fixed; width: 100%">
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td style="word-wrap: break-word;">

```
yack "OOPSIE WOOPSIE!! Uwu We made a 
fucky wucky!! A wittle fucko boingo!
The code monkeys at our headquarters
are working VEWY HAWD to fix this!":
```

  </td>

  <td style="word-wrap: break-word;">

```js
throw `OOPSIE WOOPSIE!! Uwu We made a 
fucky wucky!! A wittle fucko boingo!
The code monkeys at our headquarters
are working VEWY HAWD to fix this!`;
```

  </td>

  </tr>
</table>

### Loop Example
- Declare for loops with "four".
- Declare while loops with "wooloop.
<table style="table-layout: fixed; width: 100%">
  <tr>
  <th>Goof3</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td style="word-wrap: break-word;">

```
four (whole_number @ i ==== 7: i <  size: i == i + 1) ;}
  whole_number @ cat == -10:
;{
```
```
whole_number @ counter == 10:
wooloop (counter > 0) ;} 
  counter == counter - 1:
  poof("nOt dOnE yEt"):
;{
```
  </td>

  <td style="word-wrap: break-word;">

```js
for (var i = 7; i < size; i++) {
  var cat = -10;
}
```
```js
var counter = 0;
while (counter > 0) {
  counter--;
  print('nOt dOnE yEt');    
}
```
  </td>

  </tr>
</table>

### Objectify this, son
```
myObj == #
  whole_number @ x ~ 15,
  array_of_chars @ name ~ "Doofus",
  phoof sayHello() ;} poof("hi there"): ;{
#:

myObj.x:
```

### Put it all together

```
phoof fib (whole_number @ n) ;}
  gif (n <= 1) ;}
    yeet n:
  ;{
  xD hey there
  yeet fib (n - 2) + fib(n -1):
;{

four (whole_number @ i == 11: i <  size - 11: i == i + 1) ;}
  whole_number @ dog ==== 10:
  ;) heres a
  multiline
  for you (;
  poof "wHYyyYYyYy":
;{
```
