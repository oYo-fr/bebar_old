const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const Handlebars = require('handlebars');
const path = require('path');

export class Partial {
  constructor(public file: string, public name?: string) {
    if (!this.name) {
      this.name = path.parse(this.file).name;
    }
  }

  public async Load() {
    try {
      const content = await readFile(this.file, 'utf-8');
      Handlebars.registerPartial(this.name, content);
      console.log('registered partial ' + `${this.name}`.green);
      Promise.resolve();
    } catch (e) {
      console.log(`Error registering partial ${this.name}`.red);
      console.error(e);
      Promise.reject(e);
    }
  }
}
