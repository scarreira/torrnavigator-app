function getParameters(isIdx = false) {
  var urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get("category");
  const search = urlParams.get("searchQuery");
  if (cat) {
    $("#category").val(cat);
    if (isIdx) {
      loadCategory(cat);
    }
  }

  if (search) {
    $("#search").val(search);
    if (isIdx) {
      searchByQuery(search);
    }
  }
}
