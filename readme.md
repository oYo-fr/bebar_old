# Bebar
## What is it?

Bebar is a simple tool to transform any data into something else.
As an example, you may have a json or a yaml file that you want to transform to produce a markdown file, then bebar can help you!

## Installation

`npm install -g bebar`

## usage
`bebar -f *.bebar -w ./sample`
* `-f` (`--filename`, default '**/*.bebar'): Where your bebar file is (you can use wildcards to process multiple files at the same time),
* `-w` (`--workdir`, default '.'): the working directory that will be used in case you use relative paths in your bebar file.

## Syntax sample

``` yaml
helpers:
  - ./helpers/*.js
partials:
  - ./partials/*.mustache
data:
  -
    name: list_of_persons_json
    file: ./data/persons.json
  -
    name: list_of_persons_yaml
    file: ./data/persons.yaml
  -
    name: list_of_persons_js
    file: ./data/persons.js
  -
    name: meta
    file: ./data/meta.json
templates:
  -
    file: ./templates/persons.mustache
    output: ./out/{{meta.output}}.html
```

## Data

This represents the data you want to load. You can use json, xml, yaml files, and js files.
A data file has a `name` which you will use later on in you templates to access your data, and a file, which points to the file you want to load.
You can define one or mode `data` nodes either:
- at the root of your bebar file to make it accessible to all of your templates
- under a `template` node to make it accessible only to a particular template

### js files

Js files are handy because with this, you can extend what you can do with no limits.

#### simple js files

An easy example:
``` js
module.exports = [
  { name: 'Nils', age: 24 },
  { name: 'Teddy', age: 14 },
  { name: 'Nelson', age: 45 },
];
```

#### A js file with a promise

An easy example:
``` js
module.exports = async () => {
  return [
    { name: 'Nils', age: 24 },
    { name: 'Teddy', age: 14 },
    { name: 'Nelson', age: 45 },
  ];
};
```
#### A more complex js file with a promise, that accepts an input

In this example, the js file returns a specific node from a provided file:
``` js
module.exports = async (context) => {
  const fs = require('fs');
  const util = require('util');
  const readFile = util.promisify(fs.readFile);
  const path = require('path');
  const YAML = require('yaml');

  const yaml = await readFile(
    path.resolve(context.workingDir, context.file),
    'utf-8'
  );
  const data = YAML.parse(yaml);
  return {
    name: context.definition,
    content: data.definitions[context.definition],
  };
};
```
In your bebar file, the context is filed like this:
``` yaml
data:
  -
    name: definition
    file: ./data/swagger-definition-select.js
    context:
      file: ./data/petstore.yaml
      definition: Category
```
## Templates
Templates represents how you want your files to be presented. These are composed with:
* a file: represents the path to your template file
* an outpout: represents where the produced file should be writen.

Note: you can use handlebar syntax in the outpout file value, like this:
``` yaml
templates:
  -
    file: ./templates/typescript.hbs
    output: ./out/sub/{{definition.name}}.ts
```
Assuming you have defined a `data` node named `definition` that produces an object with a `name` property havin the value "Category", the resulting outpout filename will be `./out/sub/Category.ts`

The content of a template file looks like this:
``` mustache
export
class
{{definition.name}}{
{{#each definition.content.properties}}
  {{@key}}: {{toTsType type}};
{{/each}}
}
```
For more information about the handlebar syntax, please visit [handlebarsjs.com](https://handlebarsjs.com/).

Assuming that your datafile returns something like this:
``` yaml
  Category:
    properties:
      id:
        type: integer
        format: int64
      name:
        type: string
```
The resulting output will be something like this:
``` typescript
export
class
Category {
  id: number;
  name: string;
}
```
The outpout is supposed to be some typescript code... Have you noticed? It's not well formated...
You can fix this with ease by specifying an outpout prettifier like this:
``` yaml
templates:
  -
    file: ./templates/typescript.hbs
    output: ./out/sub/{{definition.name}}.ts
    prettify:
      parser: typescript
```
And VOILA! Your outpout will now look like this:
``` typescript
export class Category {
  id: number;
  name: string;
}
```
For more information about the prettifyer options, please visit [prettier.io](https://prettier.io/).

## Partials

Partials are just a way to split your templates in little pieces with the same syntax you use in a template file.

You can add a `partials` node in your bebar file like this:
``` yaml
partials:
  - ./partials/*.hbs
```
You can call a partial like this, assuming you have a file named `person.hbs` in your `partials` folder:
``` mustache
{{#each persons}}
* {{>person person=.}}
{{/each}}
```

## Helpers
Helpers provide a way for you to add more logic on how your data is formated.
An example of a helper file:
``` js
module.exports = {
  toPascalCase : function(str) {
    return str.replace(/(^(.)|\W+(.))/g, function(match, chr)
    {
      return chr.toUpperCase().replace(/\W/g, "");
    });
  },
  toCamelCase : function(str) {
    return str.replace(/\W+(.)/g, function(match, chr)
    {
      return chr.toUpperCase();
    });
  }
};
```

This defines two methods (`toPascalCase` and `toCamelCase`). Assuming you have the following object:
``` yaml
name: my-object
```
The following mustache template:
``` mustache
Original: {{model.name}}
Pascal case: {{toPascalCase model.name}}
Camel case: {{toCamelCase model.name}}
```
Will produce the following outpout:
```
Original: my-object
Pascal case: MyObject
Camel case: myObject
```
## Prefabs
Bebar commes bundled with a bunch of prefabs you can use in your projects! These are partials and helper functions you can import in you bebar file like this:
``` yaml
helpers:
  - ./node_modules/bebar/helpers/**/*.js
partials:
  - ./node_modules/bebar/partials/**/*.hbs

```
You can also choose to import only the prefabs you are interested in by importing only one ore more of the subfolders available.

[More information about provided helpers here](./prefabs)


Have fun using bebar files!