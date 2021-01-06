const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const Handlebars = require('handlebars');
const path = require('path');
const chalk = require('chalk');

export class Partial {
  public registeredPartials: string[] = [];

  constructor(public file: string, public name?: string) {
    this.file = path.normalize(this.file);
    if (!this.name) {
      this.name = path.parse(this.file).name;
    }
  }

  public async Load(content?: string) {
    try {
      const template = content ? content : await readFile(this.file, 'utf-8');
      await Handlebars.registerPartial(this.name, template);
      this.registeredPartials.push(`${this.name}`);
      console.log(
        chalk.green(`🧩  Registered partial ${this.name} from ${this.file}`)
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

  public async Unload() {
    await Promise.all(
      this.registeredPartials.map(
        async (p) => await Handlebars.unregisterPartial(p)
      )
    );
    this.registeredPartials = [];
  }

  public async HandleRefresh(file: string, content: string): Promise<boolean> {
    if (this.file === file) {
      await this.Unload();
      await this.Load(content);
      return true;
    }
    return false;
  }
}
