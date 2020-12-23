#!/usr/bin/env node

import { BebarParser } from './lib/BebarParser';
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const { glob } = require('glob');

clear();
console.log(chalk.blue(figlet.textSync('bebar', { horizontalLayout: 'full' })));

program
  .version('0.0.1')
  .description(
    'Command line utility to transform data using handlebar templates'
  )
  .option(
    '-f, --filename <filename>',
    'Input bebar file pattern',
    './**/*.bebar'
  )
  .option('-w, --workdir <workdir>', 'Working directory', '.')
  .parse(process.argv);

class App {
  async run(filename: string, workdir: string) {
    const loaders = glob
      .sync(path.resolve(workdir, filename))
      .map((file: any) => new BebarParser(file, workdir));

    for (var i = 0; i < loaders.length; i++) {
      await loaders[i].Load();
      await loaders[i].Build();
      await loaders[i].WriteAll();
    }
  }
}
const app = new App();
app.run(program.filename, program.workdir);
