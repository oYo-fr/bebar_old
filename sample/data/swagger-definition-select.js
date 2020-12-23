module.exports = async (context) => {
  const fs = require('fs');
  const util = require('util');
  const readFile = util.promisify(fs.readFile);
  const path = require('path');
  const YAML = require('yaml');

  const yaml = await readFile(
    path.resolve(context.workingDir, context.file),
    'utf-8'
  );
  const data = YAML.parse(yaml);
  return {
    name: context.definition,
    content: data.definitions[context.definition],
  };
};
