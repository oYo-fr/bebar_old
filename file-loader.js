/** Handles loading of a file */

const path = require('path');

class FileLoader {
  _filename;
  _name;

  constructor(filename) {
    this._filename = filename;
    this._name = path.parse(this._filename).name;
  }
}

module.exports = FileLoader;
