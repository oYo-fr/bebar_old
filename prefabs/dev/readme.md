
# Dev prefabs
## Import
``` yaml
helpers:
  - ./node_modules/bebar/helpers/dev/**/*.js
partials:
  - ./node_modules/bebar/partials/dev/**/*.hbs

```
## Helpers
### toPascalCase
Returns the pascal case version of a string
#### parameters
* ```string``` The string to convert to pascal case
#### result
* ```string``` The string, in it's pascal case version

### toCamelCase
Returns the camel case version of a string
#### parameters
* ```string``` The string to convert to camel case
#### result
* ```string``` The string, in it's camel case version

### toSnakeCase
Returns the snake case version of a string
#### parameters
* ```string``` The string to convert to snake case
#### result
* ```string``` The string, in it's snake case version

### toKebabCase
Returns the kebab case version of a string
#### parameters
* ```string``` The string to convert to kebab case
#### result
* ```string``` The string, in it's kebab case version
