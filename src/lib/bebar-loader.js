/** Handles loading of a .bebar file */

const YAML = require('yaml');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
require('colors');
const PartialLoader = require('./partial-loader');
const HelperLoader = require('./helper-loader');
const TemplateLoader = require('./template-loader');
const DataLoader = require('./data-loader');
const { glob } = require('glob');

class BebarLoader {
  _filename;
  _workingdir;
  _bebar;
  _partials = [];
  _helpers = [];
  _data = [];
  _templates = [];
  _allData = {};
  outputs = [];

  constructor(filename, workingdir) {
    this._filename = filename;
    this._workingdir = workingdir ? workingdir : '.';
    this._filename = path.resolve(this._workingdir, this._filename);
  }

  async load(){
    try{
      var yaml = await readFile(this._filename, 'utf-8');
      this._bebar = YAML.parse(yaml);
      console.log("Loaded bebar file " + `${this._filename}`.green);
    } catch(e) {
      console.log(`Error loading bebar ${this._filename}`.red);
      console.error(e);
      throw e;
    }

    await this.loadPartials();
    await this.loadHelpers();
    await this.loadData();
    await this.loadTemplates();
    Promise.resolve();
  }

  async loadPartials(){
    this._partials = this._bebar.partials.map(pattern => glob.sync(path.resolve(this._workingdir, pattern)).map(file => new PartialLoader(file))).flat();
    await Promise.all(this._partials.map(p => p.load()));
    Promise.resolve();
  }

  async loadHelpers(){
    this._helpers = this._bebar.helpers.map(pattern => glob.sync(path.resolve(this._workingdir, pattern)).map(file => new HelperLoader(file))).flat();
    await Promise.all(this._helpers.map(p => p.load()));
    Promise.resolve();
  }

  async loadData(){
    this._data = this._bebar.data.map(dataDescription => new DataLoader(dataDescription, this._workingdir));
    await Promise.all(this._data.map(p => p.load(this._allData)));
    this._allData = {
      ...this._allData,
      bebar: this._bebar
    }
    Promise.resolve();
  }

  async loadTemplates(){
    this._templates = this._bebar.templates.map(templateDescription => new TemplateLoader(templateDescription, this._workingdir));
    await Promise.all(this._templates.map(p => p.load(this._allData)));
    Promise.resolve();
  }

  async compileAll(){
    await Promise.all(this._templates.map(p => p.compile(this._allData)));

    this.outputs = this._templates.map(t => { return { "filename" : t._templateDescription.output, "output" : t._output}; });
    Promise.resolve();
  }

  async writeOutputs(){
    await Promise.all(this._templates.map(p => p.writeOutput()));
    Promise.resolve();
  }
}

module.exports = BebarLoader;
