import { Datafile } from './Datafile';
import { Helper } from './Helper';
import { Template } from './Template';
import { Partial } from './Partial';
import { Output } from './Output';
const { glob } = require('glob');
const path = require('path');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

export class Bebar {
  data: Datafile[] = [];
  templates: Template[] = [];
  partials: Partial[] = [];
  helpers: Helper[] = [];
  workingDir: string = '.';
  outputs: Output[] = [];

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
    this.data = this.data.map((d) =>
      Object.assign(new Datafile(path.resolve(this.workingDir, d.file), d.name))
    );
    this.templates = this.templates.map((t) =>
      Object.assign(
        new Template(
          path.resolve(this.workingDir, t.file),
          t.output,
          this.workingDir,
          t.data,
          t.prettify
        )
      )
    );
    await Promise.all(this.partials.map((p) => p.Load()));
    await Promise.all(this.helpers.map((h) => h.Load()));
    await Promise.all(this.data.map((d) => d.Load()));
    await Promise.all(this.templates.map((t) => t.Load()));
  }

  public async Build() {
    var allData = {};
    await this.data.forEach((d) => {
      allData = {
        ...allData,
        [d.name]: d.data,
      };
    });
    await Promise.all(this.templates.map((t) => t.Build(allData)));
    this.outputs = this.templates.map((t) => t.out);
  }

  public async WriteAll() {
    await Promise.all(
      this.outputs.map(async (o) => {
        fs.mkdirSync(path.dirname(o.file), { recursive: true });
        await writeFile(o.file, o.content);
      })
    );
  }
}
