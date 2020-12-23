import { Bebar } from './api/Bebar';

const YAML = require('yaml');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path');
const chalk = require('chalk');

export class BebarParser {
  bebar!: Bebar;
  constructor(public file: string, public workingDir: string) {}

  public async Load() {
    console.log('');
    console.log(chalk.blue.bgWhite.bold(`Processing bebar file: ${this.file}`));

    const yaml = await readFile(
      path.resolve(this.workingDir, this.file),
      'utf-8'
    );
    this.bebar = Object.assign(new Bebar(), YAML.parse(yaml));
    this.bebar.workingDir = this.workingDir;
    await this.bebar.Load();
  }

  public async Build() {
    await this.bebar.Build();
  }

  public async WriteAll() {
    await this.bebar.WriteAll();
  }
}
