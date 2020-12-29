import { Datafile } from './Datafile';
import { Helper } from './Helper';
import { Template } from './Template';
import { Partial } from './Partial';
import { Output } from './Output';
const { glob } = require('glob');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const chalk = require('chalk');
const readFile = util.promisify(fs.readFile);
const YAML = require('yaml');
const Handlebars = require('handlebars');
const _ = require('lodash');
const path = require('path');

export class Bebar {
  data: Datafile[] = [];
  templates: Template[] = [];
  partials: Partial[] = [];
  helpers: Helper[] = [];
  workingDir: string = '.';
  outputs: Output[] = [];
  next: string[] = [];
  private subBebars!: Bebar[];

  public async LoadData(fromFile: string) {
    console.log('');
    console.log(chalk.blue.bgWhite.bold(`Processing bebar file: ${fromFile}`));
    const self = this;
    this.data = await Promise.all(
      this.data.map((d) => {
        const path = require('path');
        return Object.assign(
          new Datafile(
            path.resolve(self.workingDir, d.file),
            d.name,
            d.context,
            this.workingDir
          )
        );
      })
    );
    await Promise.all(this.data.map((d) => d.Load()));
  }

  public async LoadNextBebars() {
    if (!this.next) return;
    const self = this;
    this.subBebars = await Promise.all(
      this.next.map(async (nextBebar) => {
        const path = require('path');
        const template = await readFile(
          path.resolve(self.workingDir, nextBebar),
          'utf-8'
        );
        const allData = await self.GetAllData(self);
        const bebar = Handlebars.compile(template);
        const bebarCompiled = bebar(allData);
        const yaml = YAML.parse(bebarCompiled);
        const result = Object.assign(new Bebar(), yaml);
        result.workingDir = self.workingDir;
        await result.LoadData(result, allData);
        await result.Load();
        return result;
      })
    );
  }

  public async Load() {
    await this.LoadNextBebars();

    const partialFiles = this.partials
      .map((p) => glob.sync(path.resolve(this.workingDir, p)))
      .flat();
    const helperFiles = this.helpers
      .map((p) => glob.sync(path.resolve(this.workingDir, p)))
      .flat();
    this.partials = await partialFiles.map((f) =>
      Object.assign(new Partial(f))
    );
    this.helpers = helperFiles.map((f) => Object.assign(new Helper(f)));
    this.templates = this.templates.map((t) => {
      const path = require('path');
      return Object.assign(
        new Template(
          t.file ? path.resolve(this.workingDir, t.file) : '',
          t.content,
          t.output,
          this.workingDir,
          t.data,
          t.prettify
        )
      );
    });
    await Promise.all(this.helpers.map((h) => h.Load()));
    await Promise.all(this.partials.map((p) => p.Load()));
    await Promise.all(this.templates.map((t) => t.Load()));
  }

  public async GetAllData(bebar: any, previousData?: any): Promise<any> {
    var allData = { bebar: _.cloneDeep(bebar) } as any;
    await Promise.all(
      this.data.map((d) => {
        allData[d.name] = d.data;
      })
    );
    if (previousData) {
      allData = {
        ...allData,
        ...previousData,
      };

      await Promise.all(
        Object.keys(previousData).map((k) => {
          if (allData.bebar[k] && Array.isArray(allData.bebar[k])) {
            allData.bebar[k] = allData.bebar[k].concat(previousData.bebar[k]);
          } else {
            allData.bebar[k] = previousData.bebar[k];
          }
        })
      );
    }

    return allData;
  }

  public async Build(bebar: any) {
    const allData = await this.GetAllData(bebar);
    await Promise.all(this.templates.map((t) => t.Build(allData)));
    this.outputs = this.templates.map((t) => t.out);

    if (this.subBebars) {
      await Promise.all(this.subBebars.map((b) => b.Build(b)));
      this.outputs = this.outputs.concat(
        this.subBebars.map((t) => t.outputs).flat()
      );
    }
  }

  public async WriteAll() {
    await Promise.all(
      this.outputs.map(async (o) => {
        const path = require('path');
        fs.mkdirSync(path.dirname(o.file), { recursive: true });
        await writeFile(o.file, o.content);
        console.log(chalk.black.bgGreen.bold(`💾 Wrote file: ${o.file}`));
      })
    );
  }
}
