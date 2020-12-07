const Handlebars = require('handlebars');

module.exports = {
  bold : function(text) {
    var result = "**" + Handlebars.escapeExpression(text) + "**";
    return new Handlebars.SafeString(result);
  }
};
