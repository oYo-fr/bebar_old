module.exports = {
  bold: function (text) {
    const Handlebars = require('handlebars');
    var result = '**' + Handlebars.escapeExpression(text) + '**';
    return new Handlebars.SafeString(result);
  },
  yaml: function (obj) {
    const YAML = require('yaml');
    return YAML.stringify(obj);
  },
  json: function (obj) {
    return JSON.stringify(obj, null, 2);
  },
  xml: function (obj) {
    var Parser = require('fast-xml-parser').j2xParser;
    var parser = new Parser();
    return parser.parse(obj);
  },
  toTsType: function (type) {
    switch (type) {
      case 'integer':
        return 'number';
      default:
        return type;
    }
  },
};
