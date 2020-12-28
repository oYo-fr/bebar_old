module.exports = async (context) => {
  const fs = require('fs');
  const util = require('util');
  const readFile = util.promisify(fs.readFile);
  const path = require('path');

  const extention = path.parse(context.file).ext.toLowerCase();
  const content = await readFile(
    path.resolve(context.workingDir, context.file),
    'utf-8'
  );

  let data;

  switch (extention) {
    case '.json':
      data = JSON.parse(content);
      break;
    case '.yaml':
      const YAML = require('yaml');
      data = YAML.parse(content);
      break;
  }
  return {
    name: context.definition,
    content: data.definitions[context.definition],
  };
};
