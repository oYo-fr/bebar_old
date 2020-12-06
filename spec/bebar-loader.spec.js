const BebarLoader = require('./../src/lib/bebar-loader');

describe("Bebar-loader tests", function() {
  const bebarLoader = new BebarLoader('sample.bebar', './sample');
  it("should parse all files and return an output list object", async function() {
    await bebarLoader.load();
    await bebarLoader.compileAll();
    expect(bebarLoader.outputs[0].output).toBe("From Json:\r\n  Nils is 20 years old.\r\n  Teddy is 10 years old.\r\n  Nelson is 40 years old.\r\n\r\nFrom Yaml:\r\n  Nils is 22 years old.\r\n  Teddy is 12 years old.\r\n  Nelson is 42 years old.\r\n\r\nFrom js:\r\n  Nils is 24 years old.\r\n  Teddy is 14 years old.\r\n  Nelson is 44 years old.\r\n");
  });
});