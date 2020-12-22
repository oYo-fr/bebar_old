/** Handles loading of a template and data file */

require('colors');
const fs = require('fs');
const Handlebars = require('handlebars');
const FileLoader = require('./file-loader');
const DataLoader = require('./data-loader');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const prettier = require("prettier");

class TemplateLoader extends FileLoader {
  _templateDescription;
  _template;
  _output;
  _workingdir;
  _data = [];
  _allData = {};

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

      if(this._templateDescription.data){
        this._data = this._templateDescription.data.map(dataDescription => new DataLoader(dataDescription, this._workingdir));
        await Promise.all(this._data.map(p => p.load(this._allData)));
      }

      this._output = this._template(data);
    } catch(e) {
      console.log(`Error loading template ${this._name}`.red);
      console.error(e);
      throw e;
    }
  }

  async compile(data){
    try {
      const handleOutput = Handlebars.compile(this._templateDescription.output);
      this._templateDescription.output = path.resolve(this._workingdir, handleOutput(data));
      Promise.resolve();
    } catch(e) {
      console.log(`Error compiling template ${this.output}`.red);
      console.error(e);
      throw e;
    }
  }

  async writeOutput(){
    try {
      fs.mkdirSync(path.dirname(this._templateDescription.output), { recursive: true });
      let output = this._output;
      if(this._templateDescription.prettify){
        output = prettier.format(output, this._templateDescription.prettify);
      }
      await writeFile(this._templateDescription.output, output);
      console.log('-> Successfully wrote file: ' + `${this._templateDescription.output}`.black.bgGreen);
      Promise.resolve();
    } catch(e) {
      console.log(`Error writing file ${this._templateDescription.output}`.red);
      console.error(e);
      throw e;
    }
  }
}

module.exports = TemplateLoader;
