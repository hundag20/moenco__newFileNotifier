const Model = require("../database");

// List model.
class File extends Model {
  static get tableName() {
    return "files";
  }
}
module.exports = File;
