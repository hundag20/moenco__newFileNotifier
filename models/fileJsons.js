const Model = require("../database");

// fileJsons model.
class FileJson extends Model {
  static get tableName() {
    return "filesjsons";
  }
}
module.exports = FileJson;
