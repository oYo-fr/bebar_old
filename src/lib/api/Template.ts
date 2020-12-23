import { Datafile } from './Datafile';
import { Output } from './Output';
const path = require('path');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const Handlebars = require('handlebars');
const prettier = require('prettier');

export class Template {
  name: string;
  template!: any;
  out!: Output;

  constructor(
    public file: string,
    public output: string,
    public workingDir: string = '.',
    public data?: Datafile[],
    public prettify?: any
  ) {
    this.name = path.parse(this.file).name;
  }

  public async Load() {
    if (this.data) {
      this.data = this.data.map((d) =>
        Object.assign(
          new Datafile(
            path.resolve(this.workingDir, d.file),
            d.name,
            d.context,
            this.workingDir
          )
        )
      );
      await Promise.all(this.data.map((d) => d.Load()));
    }

    try {
      var content = await readFile(this.file, 'utf-8');
      this.template = Handlebars.compile(content);
      console.log('Loaded template ' + `${this.name}`.green);
      Promise.resolve();
    } catch (e) {
      console.log(`Error loading template ${this.name}`.red);
      console.error(e);
      Promise.reject(e);
    }
  }

  public async Build(allData: any) {
    this.out = new Output();
    var templateData = { ...allData };
    if (this.data) {
      await this.data.forEach((d) => {
        templateData = {
          ...templateData,
          [d.name]: d.data,
        };
      });
    }

    this.out.content = this.template(templateData);
    if (this.prettify) {
      this.out.content = prettier.format(this.out.content, this.prettify);
    }
    const outputFilename = Handlebars.compile(this.output);
    this.out.file = path.resolve(this.workingDir, outputFilename(templateData));
  }
}