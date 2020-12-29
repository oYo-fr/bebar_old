const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const YAML = require('yaml');
const fileEval = require('file-eval');
const chalk = require('chalk');

export class Datafile {
  public data: any;

  constructor(
    public file: string,
    public name: string,
    public context: any,
    public workingDir: string
  ) {}

  async Load() {
    try {
      const extention = path.parse(this.file).ext.toLowerCase();
      switch (extention) {
        case '.json':
          const json = await readFile(this.file, 'utf-8');
          this.data = JSON.parse(json);
          break;
        case '.yaml':
        case '.yml':
          const yaml = await readFile(this.file, 'utf-8');
          this.data = YAML.parse(yaml);
          break;
        case '.xml':
          var parser = require('fast-xml-parser');
          const xml = await readFile(this.file, 'utf-8');
          this.data = parser.parse(xml);
          break;
        case '.js':
          this.data = await fileEval(this.file, {
            ...this.context,
            workingDir: this.workingDir,
          });
          try {
            this.data = await this.data({
              ...this.context,
              workingDir: this.workingDir,
            });
          } catch {}
          break;
      }
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
}
