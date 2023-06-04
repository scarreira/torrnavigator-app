var dbmgr = require("./dbmgr.js");

var db = dbmgr.db;
exports.totalPages = (limit = 100, category = "null", searchQuery = "") => {
  searchQuery = searchQuery == "" ? `%%%` : `%${searchQuery}%`;

  const query =
    category != "null"
      ? `SELECT count(id) as total FROM items WHERE cat = '${category}' AND title LIKE '${searchQuery}'`
      : `SELECT count(id) as total FROM items WHERE title LIKE '${searchQuery}'`;

  let stmt = db.prepare(query);
  let res = stmt.all();
  const totalPages = Math.floor(res[0].total / limit);
  return totalPages > 0 ? totalPages : 1;
};

exports.getAll = (searchQuery = "", limit = 100, offset = 0) => {
  searchQuery = searchQuery == "" ? `%%%` : `%${searchQuery}%`;

  const query = `SELECT * FROM items WHERE title LIKE '${searchQuery}' ORDER BY id DESC LIMIT ${limit} OFFSET ${offset};`;

  let stmt = db.prepare(query);
  let res = stmt.all();
  return res;
};

exports.getCategories = () => {
  const query = "SELECT DISTINCT cat FROM items;";
  let stmt = db.prepare(query);
  let res = stmt.all();
  return res;
};

exports.filterByCategory = (searchQuery = "", category = null, limit = 100, offset = 0) => {
  searchQuery = searchQuery == "" ? `%%%` : `%${searchQuery}%`;

  if (!category || category == "null") {
    return this.getAll(searchQuery, limit, offset);
  }

  const query = `SELECT * FROM items WHERE cat = '${category}' AND title LIKE '${searchQuery}' ORDER BY id DESC LIMIT ${limit} OFFSET ${offset};`;
  let stmt = db.prepare(query);
  let res = stmt.all();

  return res;
};
