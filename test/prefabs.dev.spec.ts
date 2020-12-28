const helpers = require('../prefabs/dev/helpers/helpers');

describe('#Prefabs - helpers - dev', () => {
  it('should return the pascal case version of a string', async () => {
    expect(helpers.toPascalCase('my-variable')).toEqual('MyVariable');
    expect(helpers.toPascalCase('my variable')).toEqual('MyVariable');
    expect(helpers.toPascalCase('my;variable')).toEqual('MyVariable');
    expect(helpers.toPascalCase('my_variable')).toEqual('MyVariable');
    expect(helpers.toPascalCase(';my_variable')).toEqual('MyVariable');
  });
  it('should return the camel case version of a string', async () => {
    expect(helpers.toCamelCase('my-variable')).toEqual('myVariable');
    expect(helpers.toCamelCase('my variable')).toEqual('myVariable');
    expect(helpers.toCamelCase('my;variable')).toEqual('myVariable');
    expect(helpers.toCamelCase('my_variable')).toEqual('myVariable');
    expect(helpers.toCamelCase('My_Variable')).toEqual('myVariable');
    expect(helpers.toCamelCase('!My_Variable')).toEqual('myVariable');
  });
  it('should return the snake case version of a string', async () => {
    expect(helpers.toSnakeCase('my-variable')).toEqual('my_variable');
    expect(helpers.toSnakeCase('my variable')).toEqual('my_variable');
    expect(helpers.toSnakeCase('my;variable')).toEqual('my_variable');
    expect(helpers.toSnakeCase('my_variable')).toEqual('my_variable');
    expect(helpers.toSnakeCase('My_Variable')).toEqual('my_variable');
    expect(helpers.toSnakeCase(':My_Variable')).toEqual('my_variable');
  });
  it('should return the kebab case version of a string', async () => {
    expect(helpers.toKebabCase('my-variable')).toEqual('my-variable');
    expect(helpers.toKebabCase('my variable')).toEqual('my-variable');
    expect(helpers.toKebabCase('my;variable')).toEqual('my-variable');
    expect(helpers.toKebabCase('my_variable')).toEqual('my-variable');
    expect(helpers.toKebabCase('My_variable')).toEqual('my-variable');
    expect(helpers.toKebabCase('¨My_variable')).toEqual('my-variable');
  });
});
