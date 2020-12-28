# Common prefabs
## Import
``` yaml
helpers:
  - ./node_modules/bebar/helpers/common/**/*.js
partials:
  - ./node_modules/bebar/partials/common/**/*.hbs

```
## Helpers
### len
Returns the length of provided object. For a string, it will return it's length, for an array, it will return the number of elements in it.
#### parameters
* ```object``` The object to get the lengh from
#### result
* ```number``` The length of the object

### when
Returns the result of the comparison on two objects
#### parameters
* ```object``` The left object to compare
* ```string``` The operand to use (```"eq"```, ```"="```, ```"=="```, ```"==="```, ```"neq"```, ```"noteq"```, ```"!="```, ```"!=="```, ```"gt"```, ```">"```, ```"gtoreq"```, ```">="```, ```"lt"```, ```"<"```, ```"ltoreq"```, ```"<="```, ```"or"```, ```"||"```, ```"and"```, ```"&&"```, ```"mod"``` or ```"%"```)
* ```object``` The right object to compare
#### result
* ```boolean``` The result of the comparison

### yaml
Returns the provided object serialized as Yaml
#### parameters
* ```object``` The object to serialize
* ```number``` The indentation to use (default 2)
#### result
* ```string``` The result of the serialization

### json
Returns the provided object serialized as Json
#### parameters
* ```object``` The object to serialize
* ```number``` The indentation to use (default 2)
#### result
* ```string``` The result of the serialization