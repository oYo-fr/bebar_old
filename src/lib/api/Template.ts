import { Datafile } from './Datafile';
import { Output } from './Output';
const path = require('path');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const Handlebars = require('handlebars');
const prettier = require('prettier');
const chalk = require('chalk');

export class Template {
  template!: any;
  public out!: Output;

  constructor(
    public file: string,
    public content: string,
    public output: string,
    public workingDir: string = '.',
    public name: string = '',
    public data: Datafile[] = [],
    public prettify?: any
  ) {
    this.file = path.normalize(this.file);
    if (!this.name || this.name === '') {
      this.name = path.parse(this.file).name;
    }
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
      var content = this.content
        ? this.content
        : await readFile(this.file, 'utf-8');
      this.template = await Handlebars.compile(content);
      console.log(
        chalk.green(`🌕 Loaded template ${this.name} from ${this.file}`)
      );
      Promise.resolve();
    } catch (e) {
      console.log(
        chalk.red(`Error loading template ${this.name} from ${this.file}`)
      );
      console.error(chalk.red(e));
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

    this.out.content = await this.template(templateData);
    if (this.prettify) {
      this.out.content = prettier.format(this.out.content, this.prettify);
    }
    const outputFilename = await Handlebars.compile(this.output);
    this.out.file = path.resolve(this.workingDir, outputFilename(templateData));
  }

  public async refreshData(file: string, content: string): Promise<boolean> {
    let refresHandled = false;
    await Promise.all(
      this.data.map(async (d) => {
        if (await d.HandleRefresh(file, content)) {
          refresHandled = true;
        }
      })
    );
    return refresHandled;
  }

  public async HandleRefresh(file: string, content: string): Promise<boolean> {
    const dataRefreshed = await this.refreshData(file, content);
    if (dataRefreshed || file === this.file) {
      if (file === this.file) {
        this.content = content;
        this.template = await Handlebars.compile(content);
      }
      return true;
    }
    return false;
  }
}
