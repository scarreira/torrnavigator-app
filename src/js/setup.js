var category = "null";

function setDatabase(path) {
  return window.electron.setDatabasePath(path);
}
function getDatabase() {
  return window.electron.getDatabasePath();
}

let categories = window.electron.getCategories();

const snakeToPascal = (string) => {
  return string
    .split("/")
    .map((snake) =>
      snake
        .split("_")
        .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1))
        .join("")
    )
    .join("/");
};

categories.forEach((category) => {
  $("#category").append(
    $("<option>", {
      value: category.cat,
      text: snakeToPascal(category.cat),
    })
  );
});

$(document).ready(function () {
  const database = getDatabase();
  if (database) {
    $("#databaseExists").text(database);
  } else {
    $("#databaseExists").text("Choose a database file");
  }
});

function gotoIndex(category, search) {
  window.location.href = `./index.html?category=${category}&searchQuery=${search}`;
}

$("#category").on("change", function () {
  gotoIndex(this.value, $("#search").val());
  window.location.href = `./index.html?category=${this.value}&searchQuery=${$("#search").val()}`;
});

$("#search").on("keypress", function (e) {
  if (e.which == 13) {
    gotoIndex($("#category").val(), $(this).val());
  }
});
