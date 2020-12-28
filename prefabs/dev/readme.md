
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

## Data
The data prefab `swagger-definition-select` allows you to select only one definition node from a swagger file.

Usage example:
``` yaml
templates:
  -
    file: {{>tsSwaggerDefToInterface definition=definition}}
    output: "./out/{{definition.name}}.ts"
    prettify:
      parser: typescript
    data:
      -
        name: definition
        file: ./node_modules/bebar/prefabs/dev/data/swagger-definition-select.js
        context:
          file: ./swagger.json
          definition: Pet
```
