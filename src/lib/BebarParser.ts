import { Bebar } from './api/Bebar';

const YAML = require('yaml');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path');

export class BebarParser {
  public bebar!: Bebar;
  constructor(public file: string, public workingDir: string) {}

  public async Load() {
    const yaml = await readFile(
      path.resolve(this.workingDir, this.file),
      'utf-8'
    );
    this.bebar = Object.assign(
      new Bebar(path.resolve(this.workingDir, this.file), this.workingDir),
      YAML.parse(yaml)
    );
    this.bebar.workingDir = this.workingDir;
    await this.bebar.LoadData();
    await this.bebar.Load();
  }

  public async Build() {
    await this.bebar.Build(this.bebar);
  }

  public async WriteAll() {
    await this.bebar.WriteAll();
  }
}
