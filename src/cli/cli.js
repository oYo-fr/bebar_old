#!/usr/bin/env node

const { glob } = require('glob');
const BebarLoader = require('./../lib/bebar-loader');
const yargs = require('yargs');
const path = require('path');

class App {
  async run(){
    const argv = yargs
    .scriptName("bebar")
    .usage('$0 <cmd> [args]')
    .command('bebar', 'Command line utility that takes a bebar file that describes links to templates, partial templates, helpers, and data loader to produce an output file')
    .option('filename', {
      alias: 'f',
      type: 'string',
      default: '*',
      describe: 'Input bebar file pattern'
    })
    .option('workdir', {
      alias: 'w',
      type: 'string',
      default: '.',
      describe: 'Working directory'
    })
    .help()
    .alias('help', 'h')
    .argv;

    const loaders = glob.sync(path.resolve(argv.workdir, argv.filename)).map(file => new BebarLoader(file, argv.workdir));

    for(var i = 0; i < loaders.length; i++){
      await loaders[i].load();
      await loaders[i].writeOutputs();
    }
    // const b = new BebarLoader('sample.bebar', './sample');
    // await b.load();
    // await b.writeOutputs();
    // console.log("done!");
  }
}

const app = new App();
app.run();
