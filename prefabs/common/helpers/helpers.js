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
  yaml: function (obj, indent = 2) {
    const YAML = require('yaml');
    return YAML.stringify(obj, { indent });
  },
  json: function (obj, indent = 2) {
    return JSON.stringify(obj, null, indent);
  },
};
