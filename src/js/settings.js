const Store = require("electron-store");
const storage = new Store();
const default_bounds = [1280, 768];

function getWinSettings() {
    const size = storage.get("win-size");
    try {
        if (size) {
            return size;
        }
        storage.set("win-size", default_bounds);
        return default_bounds;
    } catch {
        return default_bounds;
    }
}

function getWinMaximized() {
    const isMaximized = storage.get("win-max");
    try {
        return isMaximized ? isMaximized : saveMaximized(false);
    } catch {
        return false;
    }
}

function saveBounds(bounds) {
    try {
        storage.get("win-size", bounds);
    } catch {
        return;
    }
}

function saveMaximized(isMaximized) {
    try {
        storage.set("win-max", isMaximized);
    } catch {
        return;
    }
}

function setDatabasePath(path) {
    try {
        storage.set("db-path", path);
    } catch {
        return;
    }
}

function getDatabasePath() {
    const db = storage.get("db-path");
    try {
        return db;
    } catch {
        return false;
    }
}

function setPerPage(perPage) {

    try {
        storage.set("tbl-perpage", perPage);
    } catch {
        return;
    }
}

function getPerPage() {
    const perPage = storage.get("tbl-perpage");
    try {
        return perPage ? perPage : 100;
    } catch {
        return 100;
    }
}

module.exports = {
    getWindowSettings: getWinSettings,
    saveBounds: saveBounds,
    getWinMaximized: getWinMaximized,
    saveMaximized: saveMaximized,
    setDatabasePath: setDatabasePath,
    getDatabasePath: getDatabasePath,
    setPerPage: setPerPage,
    getPerPage: getPerPage
};