/** Handles loading of a partial file */

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
require('colors');
const Handlebars = require('handlebars');
const FileLoader = require('./file-loader');

class PartialLoader extends FileLoader {
  async load(){
    try {
      var content = await readFile(this._filename, 'utf-8');
      Handlebars.registerPartial(this._name, content);
      console.log("registered partial " + `${this._name}`.green);
      Promise.resolve();
    } catch(e) {
      console.log(`Error registering partial ${this._name.output}`.red);
      console.error(e);
      throw e;
    }
  }
}

module.exports = PartialLoader;
