const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const YAML = require('yaml');
const chalk = require('chalk');
const nodeEval = require('node-eval');

export class Datafile {
  public data: any;
  public extension: string = '';

  constructor(
    public file: string,
    public name: string,
    public context: any,
    public workingDir: string
  ) {
    this.file = path.normalize(this.file);
  }

  async Load() {
    try {
      const content = await readFile(this.file, 'utf-8');
      this.extension = path.parse(this.file).ext.toLowerCase();
      await this.HandleContent(content);
      console.log(
        chalk.green(`🗄️  Loaded data ${this.name} from ${this.file}`)
      );
      Promise.resolve();
    } catch (e) {
      console.log(
        chalk.red(`Error loading data ${this.name} from ${this.file}`)
      );
      console.error(chalk.red(e));
      Promise.reject(e);
    }
  }

  public async HandleContent(content: string) {
    switch (this.extension) {
      case '.json':
        this.data = JSON.parse(content);
        break;
      case '.yaml':
      case '.yml':
        this.data = YAML.parse(content);
        break;
      case '.xml':
        var parser = require('fast-xml-parser');
        this.data = parser.parse(content);
        break;
      case '.js':
        const context = {
          ...this.context,
          workingDir: this.workingDir,
        };
        this.data = await nodeEval(content, this.file, context);
        try {
          this.data = await this.data(context);
        } catch {}
        break;
    }
  }

  public async HandleRefresh(file: string, content: string): Promise<boolean> {
    if (this.file === file) {
      await this.HandleContent(content);
      return true;
    }
    return false;
  }
}
