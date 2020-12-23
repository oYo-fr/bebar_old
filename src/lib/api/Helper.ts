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
    try {
      const helper = await fileEval(this.file);
      for (var i = 0; i < Object.keys(helper).length; i++) {
        const key = Object.keys(helper)[i];
        Handlebars.registerHelper(key, helper[key]);
        console.log(
          chalk.green(
            `⚙️  Registered helper function ${this.name} from ${this.file}`
          )
        );
      }
      Promise.resolve();
    } catch (e) {
      console.log(
        chalk.red(`Error registering function ${this.name} from ${this.file}`)
      );
      console.error(chalk.red(e));
      Promise.reject(e);
    }
  }
}
