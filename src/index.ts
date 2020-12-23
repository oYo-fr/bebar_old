#!/usr/bin/env node

import { BebarParser } from './lib/BebarParser';

const { glob } = require('glob');
const yargs = require('yargs');
const path = require('path');
//@ts-ignore
require('colors');
//@ts-ignore
import Colors = require('colors.ts');

class App {
  async run() {
    const argv = yargs
      .scriptName('bebar')
      .usage('$0 <cmd> [args]')
      .command(
        'bebar',
        'Command line utility that takes a bebar file that describes links to templates, partial templates, helpers, and data loader to produce an output file'
      )
      .option('filename', {
        alias: 'f',
        type: 'string',
        default: '**/*.bebar',
        describe: 'Input bebar file pattern',
      })
      .option('workdir', {
        alias: 'w',
        type: 'string',
        default: '.',
        describe: 'Working directory',
      })
      .help()
      .alias('help', 'h').argv;

    const loaders = glob
      .sync(path.resolve(argv.workdir, argv.filename))
      .map((file: any) => new BebarParser(file, argv.workdir));

    for (var i = 0; i < loaders.length; i++) {
      await loaders[i].Load();
      await loaders[i].Build();
      await loaders[i].WriteAll();
    }
    // const b = new BebarLoader('sample.bebar', './sample');
    // await b.load();
    // await b.writeOutputs();
    // console.log("done!");
  }
}

const app = new App();
app.run();
