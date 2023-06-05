var items, currentPage, totalPages, category, searchQuery, perPage, tbody;

document.addEventListener("DOMContentLoaded", async () => {
    if (!window.electron.getDatabasePath()) {
        //window.location.href = "../settings.html";

    }

    loading(true);
    try {
        items = window.electron.getAll();
    } catch {
        alert("Database missing, or corrupt. Please choose a valid database.");
        return;
    } finally {
        loading(false);
    }

    currentPage = 1;
    searchQuery = "";

    category = "null";

    tbody = document.getElementById("items");
    perPage = window.electron.getPerPage();
    $("#perpage").val(perPage);
    totalPages = window.electron.totalPages(perPage);


    initPagination(totalPages);

    setRecords(items);

    let categories = window.electron.getCategories();

    categories.forEach((category) => {
        $("#category").append(
            $("<option>", {
                value: category.cat,
                text: snakeToPascal(category.cat),
            })
        );
    });

    $("#category").val(category);

    $("#category").on("change", function() {
        loading(true);
        category = this.value;
        loadCategory(this.value);
        loading(false);
    });

    $("#perpage").on("change", async function() {
        loading(true);
        perPage = $("#perpage").val();
        window.electron.setPerPage(perPage);
        initPagination(window.electron.totalPages(perPage, category, searchQuery));
        items = window.electron.filterByCategory(searchQuery, category, perPage, currentPage * perPage - perPage);
        setRecords(items);
        loading(false);
    });

    $("#search").on("keypress", function(e) {
        if (e.which == 13) {
            searchQuery = $(this).val();
            searchByQuery(searchQuery, category, perPage, currentPage * perPage - perPage);
        }
    });
});

function loading(start = false) {
    if (start) {
        $("#loading").removeClass("d-none");
        $("#loading").addClass("d-block");
        return;
    }
    $("#loading").removeClass("d-block");
    $("#loading").addClass("d-none");
    return;
}

function unsetActive() {
    $(`.page-link`).each(function(index, element) {
        $(this).removeClass("active");
    });
}

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

function setCurrentPage(value) {
    if (value.trim() == "...") {
        return currentPage;
    }
    if (value.trim() == "Next") {
        return currentPage + 1 < totalPages ? currentPage + 1 : totalPages;
    } else if (value.trim() == `Prev`) {
        return currentPage - 1 > 0 ? currentPage - 1 : 1;
    }
    return parseInt(value);
}

function searchByQuery(searchQuery, category, limit, offset) {
    loading(true);
    currentPage = 1;
    items = window.electron.filterByCategory(searchQuery, category, limit, offset);
    totalPages = window.electron.totalPages(perPage, category, searchQuery);
    initPagination(totalPages);
    setRecords(items);
    loading(false);
}

function loadCategory(category) {
    category = category;
    currentPage = 1;
    items = window.electron.filterByCategory(searchQuery, category, perPage, currentPage * perPage - perPage);

    totalPages = window.electron.totalPages(perPage, category, searchQuery);
    initPagination(totalPages);
    setRecords(items);
}

function initPagination(totalPages) {
    var dfrd1 = $.Deferred();

    let html = `<li class="page-item">
                  <a class="page-link" href="#" aria-label="Previous">
                    Prev
                  </a>
                </li>`;

    for (let j = 1; j <= 3; j++) {
        if (j <= totalPages) {
            html += `
          <li class="page-item"><a id="page${j}" class="page-link" href="#">${j}</a></li>`;
        }
    }

    if (currentPage > 7) {
        html += ` <li class="page-item"><a class="page-link" href="#">...</a></li>`;
    }
    $("#pages").html(html);
    let displayPages;
    if (totalPages >= 3) {
        displayPages = currentPage + 6 >= totalPages ? totalPages - 3 : currentPage + 3;
    } else {
        displayPages = totalPages - 3;
    }
    let i = currentPage > 6 ? currentPage - 3 : 4;

    for (i; i <= displayPages; i++) {
        html += `<li class="page-item"><a id="page${i}" class="page-link" href="#">${i}</a></li>`;
    }

    if (currentPage <= totalPages - 7) {
        html += ` <li class="page-item"><a class="page-link" href="#">...</a></li>`;
    }

    if (totalPages > 10) {
        html += `
    <li class="page-item"><a id="page${totalPages - 2}" class="page-link" href="#">${totalPages - 2}</a></li>
    <li class="page-item"><a id="page${totalPages - 1}" class="page-link" href="#">${totalPages - 1}</a></li>
    <li class="page-item"><a id="page${totalPages}" class="page-link" href="#" >${totalPages}</a></li>`;
    }

    html += ` <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                  Next
                </a>
              </li>`;

    $(".pagination").html(html);
    $(`#page${currentPage}`).addClass("active");

    $(".page-link").on("click", function(e) {
        e.preventDefault();
        loading(true);
        unsetActive();
        currentPage = setCurrentPage($(this).text());
        items = window.electron.filterByCategory(searchQuery, category, perPage, currentPage * perPage - perPage);
        initPagination(totalPages);
        $(`#page${currentPage}`).addClass("active");

        setRecords(items);
        loading(false);
    });

    return dfrd1.promise();
}

function setRecords(rows) {
    tbody.innerHTML = "";
    rows.forEach((row) => {
        tbody.innerHTML += `<tr>
                  <td>${row.id}</td>
                  <td style="text-align: left;">${row.title}</td>
                  <td>${row.cat}</td>
                  <td>${row.dt}</td>
                  <td>${(row.size / 1000000000).toFixed(3)} GB</td>
                  <td ><a class="text-danger" href="magnet:?xt=urn:btih:${row.hash}"><i class="bi bi-magnet-fill"></i></a></td>
                </tr>`;
    });
}