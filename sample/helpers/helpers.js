module.exports = {
  bold: function (text) {
    const Handlebars = require('handlebars');
    var result = '**' + Handlebars.escapeExpression(text) + '**';
    return new Handlebars.SafeString(result);
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
