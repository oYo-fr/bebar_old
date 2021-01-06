import { Bebar } from './api/Bebar';

const YAML = require('yaml');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path');
const _ = require('lodash');

export class BebarParser {
  public bebar!: Bebar;
  constructor(public file: string, public workingDir: string) {
    this.file = path.normalize(this.file);
  }

  public async Load() {
    const yaml = await readFile(
      path.resolve(this.workingDir, this.file),
      'utf-8'
    );
    const rawBebar = YAML.parse(yaml);
    this.bebar = Object.assign(
      new Bebar(path.resolve(this.workingDir, this.file), this.workingDir, {
        bebar: _.cloneDeep(rawBebar),
      }),
      rawBebar
    );
    this.bebar.workingDir = this.workingDir;
    await this.bebar.LoadData();
    await this.bebar.Load();
  }

  public async Build() {
    await this.bebar.Build();
  }

  public async WriteAll() {
    await this.bebar.WriteAll();
  }

  public async HandleRefresh(file: string, content: string): Promise<boolean> {
    const normalizedFilePath = path.normalize(file);
    if (this.file === normalizedFilePath) {
      console.log('Root bebar file changed; reloading...');
      if (this.bebar) {
        await this.bebar.Unload();
      }
      this.bebar = Object.assign(
        new Bebar(path.resolve(this.workingDir, this.file), this.workingDir),
        YAML.parse(content)
      );
      await this.bebar.LoadData();
      await this.bebar.Load();
      return true;
    } else {
      return await this.bebar.HandleRefresh(normalizedFilePath, content);
    }
  }
}
