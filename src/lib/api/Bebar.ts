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
const path = require('path');

export class Bebar {
  public data: Datafile[] = [];
  public templates: Template[] = [];
  public partials: Partial[] = [];
  public helpers: Helper[] = [];
  public outputs: Output[] = [];
  public next: string[] = [];
  public nextBebars: Bebar[] = [];

  constructor(
    public file: string,
    public workingDir: string = '.',
    public additionalData: any = {}
  ) {
    this.file = path.normalize(this.file);
  }

  public async LoadData() {
    console.log('');
    console.log(chalk.blue.bgWhite.bold(`Processing bebar file: ${this.file}`));
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
    this.nextBebars = await Promise.all(
      this.next.map(async (nextBebar) => {
        const path = require('path');
        const template = await readFile(
          path.resolve(self.workingDir, nextBebar),
          'utf-8'
        );
        const allData = await self.GetAllData();
        const bebar = await Handlebars.compile(template);
        const bebarCompiled = bebar(allData);
        const yaml = YAML.parse(bebarCompiled);

        const result = Object.assign(
          new Bebar(
            path.resolve(this.workingDir, nextBebar),
            self.workingDir,
            this.additionalData
          ),
          yaml
        );
        await result.LoadData(result, allData);
        await result.Load();
        return result;
      })
    );
  }

  public async Load() {
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
          t.name,
          t.data,
          t.prettify
        )
      );
    });
    await Promise.all(this.helpers.map((h) => h.Load()));
    await Promise.all(this.partials.map((p) => p.Load()));
    await Promise.all(this.templates.map((t) => t.Load()));
    await this.LoadNextBebars();
  }

  public async Unload() {
    await Promise.all(this.helpers.map((h) => h.Unload()));
    await Promise.all(this.partials.map((h) => h.Unload()));
  }

  public async GetAllData(): Promise<any> {
    var allData = {} as any;
    await Promise.all(
      this.data.map((d) => {
        allData[d.name] = d.data;
      })
    );
    if (this.additionalData) {
      allData = {
        ...allData,
        ...this.additionalData,
      };
    }

    return allData;
  }

  public async Build() {
    const allData = await this.GetAllData();
    await Promise.all(this.templates.map(async (t) => await t.Build(allData)));
    this.outputs = this.templates.map((t) => t.out);

    if (this.nextBebars) {
      await Promise.all(this.nextBebars.map(async (b) => await b.Build()));
      this.outputs = this.outputs.concat(
        this.nextBebars.map((b) => b.outputs).flat()
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

  public async refreshData(file: string, content: string): Promise<boolean> {
    let refresHandled = false;
    await Promise.all(
      this.data.map(async (d) => {
        if (await d.HandleRefresh(file, content)) {
          await this.Build();
          refresHandled = true;
        }
      })
    );
    return refresHandled;
  }

  public async refreshNextBebars(
    file: string,
    content: string,
    force: boolean = false
  ): Promise<boolean> {
    let refresHandled = false;
    await Promise.all(
      this.nextBebars.map(async (n, index) => {
        if (force || n.file === file) {
          const allData = await this.GetAllData();
          const bebar = await Handlebars.compile(content);
          const bebarCompiled = bebar(allData);
          const yaml = YAML.parse(bebarCompiled);

          const result = Object.assign(
            new Bebar(path.resolve(this.workingDir, n), this.workingDir),
            yaml
          );
          await result.LoadData(result, allData);
          await result.Load();
          await result.Build();
          this.nextBebars[index] = result;
          refresHandled = true;
        }
      })
    );
    return refresHandled;
  }

  public async refreshTemplates(
    file: string,
    content: string,
    force: boolean = false
  ): Promise<boolean> {
    let refresHandled = false;
    const allData = await this.GetAllData();
    await Promise.all(
      this.templates.map(async (t) => {
        if (force) {
          await t.HandleRefresh(file, content);
          await t.Build(allData);
          refresHandled = true;
        } else {
          if (await t.HandleRefresh(file, content)) {
            await t.Build(allData);
            refresHandled = true;
          }
        }
      })
    );
    return refresHandled;
  }

  public async refreshHelpers(file: string, content: string): Promise<boolean> {
    let refresHandled = false;
    await Promise.all(
      this.helpers.map(async (t) => {
        if (await t.HandleRefresh(file, content)) {
          await this.Build();
          refresHandled = true;
        }
      })
    );
    return refresHandled;
  }

  public async refreshPartials(
    file: string,
    content: string
  ): Promise<boolean> {
    let refresHandled = false;
    await Promise.all(
      this.partials.map(async (t) => {
        if (await t.HandleRefresh(file, content)) {
          await this.Build();
          refresHandled = true;
        }
      })
    );
    return refresHandled;
  }

  public async HandleRefresh(file: string, content: string): Promise<boolean> {
    const dataRefreshed = await this.refreshData(file, content);
    const partialsRefreshed = await this.refreshPartials(file, content);
    const helpersRefreshed = await this.refreshHelpers(file, content);
    const templatesRefreshed = await this.refreshTemplates(
      file,
      content,
      dataRefreshed || partialsRefreshed || helpersRefreshed
    );
    const nextRefreshed = await this.refreshNextBebars(
      file,
      content,
      dataRefreshed
    );

    if (
      dataRefreshed ||
      partialsRefreshed ||
      helpersRefreshed ||
      templatesRefreshed ||
      nextRefreshed
    ) {
      this.outputs = this.templates.map((t) => t.out);
      if (this.nextBebars) {
        this.outputs = this.outputs.concat(
          this.nextBebars.map((b) => b.outputs).flat()
        );
      }
      return true;
    }
    return false;
  }
}
