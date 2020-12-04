# bebar
## A simple tool to define in one file handlebar (mustache) templates, partials, data, and outputs.

## installation
`npm install -g bebar`

## syntax
```
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
Here,
- all helpers in directory "helpers" will be loaded. These will contain javascript methods that will be usable un templates and partial files.
- partial files are loaded from directory "partials". These are small reusable mustache template files. Each partial will be named after the name of the file.
- data from a json, a yaml, and a js files are loaded. These data will be callable in the mustache templates and partials by their names.
- templates are loaded to produce file outputs. Note that you can use mustache templating here to produce the output file name.
