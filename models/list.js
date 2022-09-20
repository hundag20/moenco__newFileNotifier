const Model = require("../database");

// List model.
class List extends Model {
  static get tableName() {
    return "list";
  }
}
module.exports = List;
