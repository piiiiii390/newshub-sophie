const apiKey = "ce35ce93c19f45689d2fea0c01902bb1";

$(document).ready(function () {
  loadNews("general");

  $(".news-category").click(function () {
    $(".news-category").removeClass("active");
    $(this).addClass("active");

    const category = $(this).data("category");
    loadNews(category);
  });

  $("#searchButton").click(function () {
    const query = $("#searchInput").val();
    if (query.trim() !== "") loadNews("general", query);
  });

  $("#searchInput").keypress(function (e) {
    if (e.which === 13) {
      const query = $(this).val();
      if (query.trim() !== "") loadNews("general", query);
    }
  });
});

function loadNews(category = "general", query = "") {
  const container = $("#news-container");
  container.html("<p class='text-center text-muted'>Loading news...</p>");

  let url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
  if (query) url += `&q=${query}`;

  const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);

  $.getJSON(proxyUrl, function (data) {
    container.html("");

    if (!data.articles || !data.articles.length) {
      container.html("<p class='text-center text-muted'>No news available.</p>");
      return;
    }

    data.articles.slice(0, 9).forEach((a) => {
      const title = a.title || "No Title";
      const desc = a.description || "No description available.";
      const image = a.urlToImage || "https://via.placeholder.com/400x200";
      const link = a.url || "#";

      container.append(`
        <div class="col-md-4 col-sm-6 mb-4">
          <div class="card">
            <img src="${image}" class="card-img-top" alt="news">
            <div class="card-body">
              <h6 class="fw-bold text-primary">${title}</h6>
              <p class="card-description">${desc}</p>
              <a href="#" class="read-more-btn mt-auto">Read More</a>
              <a href="${link}" target="_blank" class="btn btn-outline-primary btn-sm mt-2">Go to Source</a>
            </div>
          </div>
        </div>
      `);
    });

    $(".read-more-btn").on("click", function (e) {
      e.preventDefault();
      const desc = $(this).siblings(".card-description");
      desc.toggleClass("expanded");

      if (desc.hasClass("expanded")) {
        $(this).text("Read Less");
      } else {
        $(this).text("Read More");
      }
    });
  }).fail(() => {
    container.html("<p class='text-center text-danger'>Failed to load news.</p>");
  });
}
