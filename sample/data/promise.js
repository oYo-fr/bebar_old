module.exports = async () => {
  const fs = require('fs'); // <- this should not crash
  return [
    { name: 'Nils', age: 24 },
    { name: 'Teddy', age: 14 },
    { name: 'Nelson', age: 45 },
  ];
};
