const Handlebars = require('handlebars');
const fileEval = require('file-eval');
const path = require('path');
const chalk = require('chalk');

export class Helper {
  constructor(public file: string, public name?: string) {
    if (!this.name) {
      this.name = path.parse(this.file).name;
    }
  }

  public async Load() {
    const helper = await fileEval(this.file);
    for (var i = 0; i < Object.keys(helper).length; i++) {
      const key = Object.keys(helper)[i];
      try {
        Handlebars.registerHelper(key, helper[key]);
        console.log(
          chalk.green(`⚙️  Registered helper function ${key} from ${this.file}`)
        );
      } catch (e) {
        console.log(
          chalk.red(`Error registering function ${key} from ${this.file}`)
        );
        console.error(chalk.red(e));
        Promise.reject(e);
      }
    }
    Promise.resolve();
  }
}
