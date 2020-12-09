

module.exports = (async() => {
  const fs = require('fs'); // <- this should not crash
  return {status: 'promise result is working'};
});
