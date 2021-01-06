import { BebarParser } from '../src/lib/BebarParser';
const path = require('path');

describe('Load sample', () => {
  async function editFile(
    workingDir: string,
    parser: BebarParser,
    file: string,
    content: string
  ): Promise<boolean> {
    const p = path.resolve(workingDir, file);
    return await parser.HandleRefresh(p, content);
  }
  it('should handle file content replacement properly', async () => {
    const workingDir = './sample';
    const parser = new BebarParser('complete-example.bebar', workingDir);
    await parser.Load();
    await parser.Build();
    let handled = false;

    // Edit nothing relevant
    handled = await editFile(workingDir, parser, './unused file.hbs', ``);
    expect(handled).toBeFalsy();

    // Edit relevant data file
    handled = await editFile(
      workingDir,
      parser,
      './data/promise.js',
      `module.exports = [
      { name: 'EDITED', age: 666 }
    ];`
    );
    expect(handled).toBeTruthy();
    expect(parser.bebar.outputs[0].content).toContain('EDITED');
    expect(parser.bebar.outputs[0].content).toContain('666');

    // Edit relevant template
    handled = await editFile(
      workingDir,
      parser,
      './templates/persons.hbs',
      `
    Template update works!
    {{#each persons}}
    * {{>person person=.}}
    {{/each}}`
    );
    expect(handled).toBeTruthy();
    expect(parser.bebar.outputs[0].content).toContain('Template update works!');
    expect(parser.bebar.outputs[0].content).toContain('EDITED');
    expect(parser.bebar.outputs[0].content).toContain('666');

    // Edit relevant partial
    handled = await editFile(
      workingDir,
      parser,
      './partials/person.hbs',
      `{{bold person.name}} is {{person.age}} years old (Partials update works!).`
    );
    expect(handled).toBeTruthy();
    expect(parser.bebar.outputs[0].content).toContain('Template update works!');
    expect(parser.bebar.outputs[0].content).toContain('Partials update works!');
    expect(parser.bebar.outputs[0].content).toContain('EDITED');
    expect(parser.bebar.outputs[0].content).toContain('666');

    // Edit relevant helper
    handled = await editFile(
      workingDir,
      parser,
      './helpers/helpers.js',
      `module.exports = {
      bold: function (text) {
        const Handlebars = require('handlebars');
        var result = '**' + Handlebars.escapeExpression(text) + '** Helper update works!';
        return new Handlebars.SafeString(result);
      }
    };`
    );
    expect(handled).toBeTruthy();
    expect(parser.bebar.outputs[0].content).toContain('Template update works!');
    expect(parser.bebar.outputs[0].content).toContain('Partials update works!');
    expect(parser.bebar.outputs[0].content).toContain('Helper update works!');
    expect(parser.bebar.outputs[0].content).toContain('EDITED');
    expect(parser.bebar.outputs[0].content).toContain('666');

    // Edit relevant data file
    handled = await editFile(
      workingDir,
      parser,
      './data/promise.js',
      `module.exports = [
      { name: 'EDITED', age: 777 }
    ];`
    );
    expect(handled).toBeTruthy();
    expect(parser.bebar.outputs[0].content).toContain('Template update works!');
    expect(parser.bebar.outputs[0].content).toContain('Partials update works!');
    expect(parser.bebar.outputs[0].content).toContain('Helper update works!');
    expect(parser.bebar.outputs[0].content).toContain('EDITED');
    expect(parser.bebar.outputs[0].content).toContain('777');
  });
});
