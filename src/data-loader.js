/** Handles loading of a partial file */

const YAML = require('yaml');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
require('colors');
const FileLoader = require('./file-loader');
const path = require('path');

class DataLoader extends FileLoader {
  _dataDescription;
  _data;
  _name;

  constructor(dataDescription, _workingdir) {
    dataDescription.file = path.resolve(_workingdir, dataDescription.file);
    super(dataDescription.file);
    this._name = dataDescription.name;
    this._dataDescription = dataDescription;
    //fs.watchFile(this._filename, {}, this.load);
  }

  async load(output){
    try{
      const extention = path.parse(this._filename).ext.toLowerCase();
      switch(extention){
        case '.json':
          const json = await readFile(this._filename, 'utf-8');
          this._data = JSON.parse(json);
          output[this._name] = this._data;
          console.log("Loaded data " + `${this._name}`.green);
          break;
        case '.yaml':
        case '.yml':
          const yaml = await readFile(this._filename, 'utf-8');
          this._data = YAML.parse(yaml);
          output[this._name] = this._data;
          console.log("Loaded data " + `${this._name}`.green);
          break;
          case '.js':
            const js = await readFile(this._filename, 'utf-8');
            const fn = new Function(js);
            this._data = fn();
            output[this._name] = this._data;
            console.log("Loaded data " + `${this._name}`.green);
            break;
      }
    } catch(e) {
      console.log(`Error loading data ${this._name}`.red);
      console.error(e);
      throw e;
    }
  }
}

module.exports = DataLoader;
