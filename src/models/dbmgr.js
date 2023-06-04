const { getDatabasePath } = require("../js/settings");

const db = require("better-sqlite3")(getDatabasePath());

exports.db = db;
