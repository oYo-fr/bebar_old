/** Handles loading of a helper file */

require('colors');
const Handlebars = require('handlebars');
const fileEval = require('file-eval');
const FileLoader = require('./file-loader');

class HelperLoader extends FileLoader {
  async load(){
    try{
      const helper = await fileEval(this._filename);
      Handlebars.registerHelper(this._name, helper);
      console.log("registered function " + `${this._name}`.green);
    } catch(e) {
      console.log(`Error registering function ${this._name}`.red);
      console.error(e);
      throw e;
    }
  }
}

module.exports = HelperLoader;
