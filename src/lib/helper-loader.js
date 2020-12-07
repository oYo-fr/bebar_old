/** Handles loading of a helper file */

require('colors');
const Handlebars = require('handlebars');
const fileEval = require('file-eval');
const FileLoader = require('./file-loader');

class HelperLoader extends FileLoader {
  async load(){
    try{
      const helper = await fileEval(this._filename);
      for(var i = 0; i < Object.keys(helper).length; i++){
        const key = Object.keys(helper)[i];
        Handlebars.registerHelper(key, helper[key]);
      }
      console.log("registered function " + `${this._name}`.green);
    } catch(e) {
      console.log(`Error registering function ${this._name}`.red);
      console.error(e);
      throw e;
    }
  }
}

module.exports = HelperLoader;
