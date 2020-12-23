const Handlebars = require('handlebars');
const fileEval = require('file-eval');
const path = require('path');

export class Helper {
  constructor(public file: string, public name?: string) {
    if (!this.name) {
      this.name = path.parse(this.file).name;
    }
  }

  public async Load() {
    try {
      const helper = await fileEval(this.file);
      for (var i = 0; i < Object.keys(helper).length; i++) {
        const key = Object.keys(helper)[i];
        Handlebars.registerHelper(key, helper[key]);
        console.log('registered function ' + `${key}`.green);
      }
      Promise.resolve();
    } catch (e) {
      console.log(`Error registering function ${this.name}`.red);
      console.error(e);
      Promise.reject(e);
    }
  }
}
