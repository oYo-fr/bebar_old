/** Handles loading of a template and data file */

require('colors');
const fs = require('fs');
const Handlebars = require('handlebars');
const FileLoader = require('./file-loader');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class TemplateLoader extends FileLoader {
  _templateDescription;
  _template;
  _output;
  _workingdir;

  constructor(templateDescription, workingdir) {
    templateDescription.file = path.resolve(workingdir, templateDescription.file);
    super(templateDescription.file);
    this._templateDescription = templateDescription;
    this._workingdir = workingdir;
  }

  async load(data){
    try{
      var content = await readFile(this._filename, 'utf-8');
      this._template = Handlebars.compile(content);
      console.log("Loaded template " + `${this._name}`.green);

      this._output = this._template(data);
    } catch(e) {
      console.log(`Error loading template ${this._name}`.red);
      console.error(e);
      throw e;
    }
  }

  async writeOutput(data){
    try {
      const handleOutput = Handlebars.compile(this._templateDescription.output);
      this._templateDescription.output = path.resolve(this._workingdir, handleOutput(data));
      await writeFile(this._templateDescription.output, this._output);
      Promise.resolve();
    } catch(e) {
      console.log(`Error writing file ${this._templateDescription.output}`.red);
      console.error(e);
      throw e;
    }
  }
}

module.exports = TemplateLoader;
