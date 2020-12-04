const Handlebars = require('handlebars');

module.exports = {
  bold : function(text) {
    var result = "<b>" + Handlebars.escapeExpression(text) + "</b>";
    return new Handlebars.SafeString(result);
  }
};
