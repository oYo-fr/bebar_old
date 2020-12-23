import { BebarParser } from '../src/lib/BebarParser';

describe('Load sample', () => {
  it('should load the sample bebar file with promise example', async () => {
    const parser = new BebarParser('promise-example.bebar', './sample');
    await parser.Load();
    await parser.Build();
    await parser.WriteAll();
    expect(parser.bebar.outputs.length).toEqual(5);
  });
});
