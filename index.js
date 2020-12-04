const BebarLoader = require('./bebar-loader');


class App {
  async run(){
    const b = new BebarLoader('sample.bebar', './sample');
    await b.load();
    await b.writeOutputs();
    console.log("done!");
  }
}

const app = new App();
app.run();
