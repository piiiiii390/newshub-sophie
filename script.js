document.addEventListener('DOMContentLoaded', () => {
 
  const newsContainer = document.getElementById('news-container');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const categoryBtns = document.querySelectorAll('.category-btn');

  let currentCategory = 'general';
  let currentSearchTerm = '';

  function init() {
    fetchNews(currentCategory);
    setupEventListeners();
  }

  function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.getAttribute('data-category');
        currentSearchTerm = '';
        searchInput.value = '';

        fetchNews(currentCategory);
      });
    });
  }

  function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      currentSearchTerm = searchTerm;
      fetchNews(currentCategory, searchTerm);
    }
  }

  function fetchNews(category, searchTerm = '') {
  newsContainer.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner"></i>
      <p>Loading news articles...</p>
    </div>
  `;

  // Ganti URL langsung ke API dengan panggilan ke proxy di Vercel
  let url = `/api/news?category=${category}`;
  if (searchTerm) {
    url = `/api/news?q=${encodeURIComponent(searchTerm)}`;
  }

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then((data) => {
      displayNews(data.articles);
    })
    .catch((error) => {
      newsContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Failed to load news</h3>
          <p>Please check your connection and try again.</p>
          <p>Error: ${error.message}</p>
        </div>
      `;
      console.error('Error fetching news:', error);
    });
}

  function displayNews(articles) {
    if (!articles || articles.length === 0) {
      newsContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-newspaper"></i>
          <h3>No news articles found</h3>
          <p>Try a different search term or category.</p>
        </div>
      `;
      return;
    }

    newsContainer.innerHTML = '';

    articles.forEach((article) => {
      const newsCard = document.createElement('div');
      newsCard.className = 'news-card';

      const publishedDate = new Date(article.publishedAt).toLocaleDateString();

      newsCard.innerHTML = `
        <div class="news-image">
          <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${article.title}" />
        </div>
        <div class="news-content">
          <div class="news-source">
            <span>${article.source.name}</span>
            <span>${publishedDate}</span>
          </div>
          <h3 class="news-title">${article.title}</h3>
          <p class="news-desc">${article.description || 'No description available.'}</p>
          <a href="${article.url}" target="_blank" rel="noopener" class="news-link">
            Read more <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      `;

      newsContainer.appendChild(newsCard);
    });
  }

  init();
});
