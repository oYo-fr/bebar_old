module.exports = {
  len: function (obj) {
    return obj.length;
  },
  when: function (operand_1, operator, operand_2, options) {
    switch (operator) {
      case 'eq':
      case '=':
      case '==':
      case '===':
        return operand_1 == operand_2;
      case 'neq':
      case 'noteq':
      case '!=':
      case '!==':
        return operand_1 != operand_2;
      case 'gt':
      case '>':
        return operand_1 > operand_2;
      case 'gtoreq':
      case '>=':
        return operand_1 >= operand_2;
      case 'lt':
      case '<':
        return operand_1 < operand_2;
      case 'ltoreq':
      case '<=':
        return operand_1 <= operand_2;
      case 'or':
      case '||':
        return operand_1 || operand_2;
      case 'and':
      case '&&':
        return operand_1 && operand_2;
      case 'mod':
      case '%':
        return operand_1 % operand_2 === 0;
      default:
        return options.inverse(this);
    }
  },
  yaml: function (obj) {
    var YAML = require('yaml');
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
};
