const { contextBridge } = require("electron");
const itemsMgr = require("./src/models/items");
const settings = require("./src/js/settings");

const getAll = (searchQuery = "", limit = 100, offset = 0) => {
  return itemsMgr.getAll(searchQuery, limit, offset);
};

const getCategories = () => {
  return itemsMgr.getCategories();
};

const filterByCategory = (searchQuery = "", category = null, limit = 100, offset = 0) => {
  return itemsMgr.filterByCategory(searchQuery, category, limit, offset);
};

const totalPages = (limit = 100, category = "null", searchQuery = "") => {
  return itemsMgr.totalPages(limit, category, searchQuery);
};

const setDatabasePath = (path) => {
  return settings.setDatabasePath(path);
};

const getDatabasePath = () => {
  return settings.getDatabasePath();
};

contextBridge.exposeInMainWorld("electron", {
  totalPages: totalPages,
  getAll: getAll,
  getCategories: getCategories,
  filterByCategory: filterByCategory,
  setDatabasePath: setDatabasePath,
  getDatabasePath: getDatabasePath,
});
