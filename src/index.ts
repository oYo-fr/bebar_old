#!/usr/bin/env node

import { BebarParser } from './lib/BebarParser';
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const { glob } = require('glob');

class App {
  async run(workdir: string, filename: string) {
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

clear();

var pjson = require('./../package.json');
console.log(chalk.blue(figlet.textSync('bebar', { horizontalLayout: 'full' })));
console.log(pjson.version);

program
  .storeOptionsAsProperties(false)
  .passCommandToAction(false)
  .version(pjson.version)
  .description(
    'Command line utility to transform data using handlebar templates'
  )
  .option(
    '-f, --filename <filename>',
    'Input bebar file pattern',
    './**/*.bebar'
  )
  .option('-w, --workdir <workdir>', 'Working directory', '.')
  .action((options: { filename: any; workdir: any }) => {
    console.log('Parsing files: ' + options.filename);
    console.log('Working directory: ' + options.workdir);
    const app = new App();
    app.run(options.workdir, options.filename);
  })
  .parse();
