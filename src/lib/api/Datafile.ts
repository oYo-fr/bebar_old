const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const YAML = require('yaml');
const fileEval = require('file-eval');

export class Datafile {
  data: any;
  workingDir: string = '.';

  constructor(public file: string, public name: string) {}

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
          this.data = await fileEval(this.file);
          try {
            this.data = await this.data();
          } catch {}
          break;
      }
      console.log('Loaded data ' + `${this.name}`.green);
      Promise.resolve();
    } catch (e) {
      console.log(`Error loading data ${this.name}`.red);
      console.error(e);
      Promise.reject(e);
    }
  }
}
