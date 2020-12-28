const helpers = require('../prefabs/common/helpers/helpers');

describe('#Prefabs - helpers - common', () => {
  it('should return the length of an object', async () => {
    expect(helpers.len('test string')).toEqual(11);
    expect(helpers.len(['a', 22])).toEqual(2);
  });

  it('should return the comparison result between two objects', async () => {
    expect(helpers.when(1, 'eq', 1)).toEqual(true);
    expect(helpers.when(1, '=', 1)).toEqual(true);
    expect(helpers.when(1, '==', 1)).toEqual(true);
    expect(helpers.when(1, '===', 1)).toEqual(true);
    expect(helpers.when(1, 'noteq', 1)).toEqual(false);
    expect(helpers.when(1, '!=', 1)).toEqual(false);
    expect(helpers.when(1, '!==', 1)).toEqual(false);
    expect(helpers.when(1, '>', 2)).toEqual(false);
    expect(helpers.when(2, 'gt', 1)).toEqual(true);
    expect(helpers.when(1, '<', 2)).toEqual(true);
    expect(helpers.when(2, 'lt', 1)).toEqual(false);
    expect(helpers.when(1, 'gtoreq', 1)).toEqual(true);
    expect(helpers.when(1, 'gtoreq', 2)).toEqual(false);
    expect(helpers.when(1, 'ltoreq', 1)).toEqual(true);
    expect(helpers.when(1, 'ltoreq', 2)).toEqual(true);
    expect(helpers.when(true, 'or', false)).toEqual(true);
    expect(helpers.when(true, '||', false)).toEqual(true);
    expect(helpers.when(true, 'and', false)).toEqual(false);
    expect(helpers.when(true, '&&', false)).toEqual(false);
    expect(helpers.when(4, 'mod', 2)).toEqual(true);
    expect(helpers.when(5, '%', 2)).toEqual(false);
  });

  it('should return the YAML serialized result of an object', async () => {
    const edgar = {
      name: 'Edgar Allan Poe',
      dates: { birth: '1809/01/19', death: '1849/10/07' },
    };
    expect(helpers.yaml(edgar)).toEqual(`name: Edgar Allan Poe
dates:
  birth: 1809/01/19
  death: 1849/10/07
`);
    expect(helpers.yaml(edgar, 4)).toEqual(`name: Edgar Allan Poe
dates:
    birth: 1809/01/19
    death: 1849/10/07
`);
  });

  it('should return the JSON serialized result of an object', async () => {
    const edgar = {
      name: 'Edgar Allan Poe',
      dates: { birth: '1809/01/19', death: '1849/10/07' },
    };
    expect(helpers.json(edgar)).toEqual(`{
  "name": "Edgar Allan Poe",
  "dates": {
    "birth": "1809/01/19",
    "death": "1849/10/07"
  }
}`);
    expect(helpers.json(edgar, 4)).toEqual(`{
    "name": "Edgar Allan Poe",
    "dates": {
        "birth": "1809/01/19",
        "death": "1849/10/07"
    }
}`);
  });
});
