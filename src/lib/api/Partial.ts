const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const Handlebars = require('handlebars');
const path = require('path');
const chalk = require('chalk');

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
      console.log(
        chalk.green(`🌙  Registered partial ${this.name} from ${this.file}`)
      );
      Promise.resolve();
    } catch (e) {
      console.log(
        chalk.red(`Error registering partial ${this.name} from ${this.file}`)
      );
      console.error(chalk.red(e));
      Promise.reject(e);
    }
  }
}
