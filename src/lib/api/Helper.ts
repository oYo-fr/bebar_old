const Handlebars = require('handlebars');
const fileEval = require('file-eval');
const anyEval = require('any-eval');
const path = require('path');
const chalk = require('chalk');

export class Helper {
  public registeredHelpers: string[] = [];

  constructor(public file: string, public name?: string) {
    this.file = path.normalize(this.file);
    if (!this.name) {
      this.name = path.parse(this.file).name;
    }
  }

  public async Load(evaluated?: any) {
    const helper = evaluated ? evaluated : await fileEval(this.file);
    for (var i = 0; i < Object.keys(helper).length; i++) {
      const key = Object.keys(helper)[i];
      try {
        await Handlebars.registerHelper(key, helper[key]);
        this.registeredHelpers.push(key);
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

  public async Unload() {
    await Promise.all(
      this.registeredHelpers.map(
        async (h) => await Handlebars.unregisterHelper(h)
      )
    );
    this.registeredHelpers = [];
  }

  public async HandleRefresh(file: string, content: string): Promise<boolean> {
    if (this.file === file) {
      await this.Unload();
      await this.Load(anyEval(content, file));
      return true;
    }
    return false;
  }
}
