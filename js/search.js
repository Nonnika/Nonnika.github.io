(function () {
  'use strict';

  let searchData = null;
  let isLoading = false;

  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const closeBtn = document.getElementById('searchClose');

  // Open search
  function openSearch() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    input.value = '';
    results.innerHTML = '<div class="search-empty">输入关键词开始搜索</div>';
    setTimeout(() => input.focus(), 100);
    if (!searchData && !isLoading) {
      loadSearchData();
    }
  }

  // Close search
  function closeSearch() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Load search.json
  function loadSearchData() {
    isLoading = true;
    const basePath = document.querySelector('link[rel="canonical"]');
    let rootPath = '/';
    if (basePath) {
      try {
        const url = new URL(basePath.href);
        rootPath = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
      } catch (e) {
        rootPath = '/';
      }
    }

    fetch(rootPath + 'search.json')
      .then(res => res.json())
      .then(data => {
        searchData = data;
        isLoading = false;
      })
      .catch(err => {
        console.error('Failed to load search data:', err);
        isLoading = false;
      });
  }

  // Escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Highlight keyword in text
  function highlight(text, keyword) {
    if (!keyword) return escapeHtml(text);
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(' + escaped + ')', 'gi');
    return escapeHtml(text).replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  // Strip HTML tags and decode entities
  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // Search and render
  function doSearch(keyword) {
    if (!keyword || keyword.trim() === '') {
      results.innerHTML = '<div class="search-empty">输入关键词开始搜索</div>';
      return;
    }

    if (!searchData) {
      results.innerHTML = '<div class="search-empty">正在加载搜索数据...</div>';
      return;
    }

    const kw = keyword.trim().toLowerCase();
    const matched = [];

    searchData.forEach(item => {
      const title = item.title || '';
      const content = stripHtml(item.content || '');
      const titleLower = title.toLowerCase();
      const contentLower = content.toLowerCase();

      let score = 0;
      if (titleLower.includes(kw)) score += 10;
      if (contentLower.includes(kw)) score += 1;

      if (score > 0) {
        // Extract snippet around the match in content
        let snippet = '';
        const idx = contentLower.indexOf(kw);
        if (idx >= 0) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(content.length, idx + kw.length + 80);
          snippet = (start > 0 ? '...' : '') + content.substring(start, end) + (end < content.length ? '...' : '');
        } else {
          snippet = content.substring(0, 120) + (content.length > 120 ? '...' : '');
        }

        matched.push({
          title: title,
          url: item.url,
          snippet: snippet,
          score: score
        });
      }
    });

    // Sort by relevance
    matched.sort((a, b) => b.score - a.score);

    if (matched.length === 0) {
      results.innerHTML = '<div class="search-empty">未找到相关文章</div>';
      return;
    }

    let html = '<ul class="search-result-list">';
    matched.forEach(item => {
      html += '<li class="search-result-item">' +
        '<a href="' + escapeHtml(item.url) + '">' +
        '<div class="search-result-title">' + highlight(item.title, keyword.trim()) + '</div>' +
        '<div class="search-result-snippet">' + highlight(item.snippet, keyword.trim()) + '</div>' +
        '</a></li>';
    });
    html += '</ul>';
    results.innerHTML = html;
  }

  // Debounce
  let timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(() => doSearch(this.value), 200);
  });

  // Close button
  closeBtn.addEventListener('click', closeSearch);

  // Click overlay backdrop to close
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeSearch();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Ctrl+K or Cmd+K to open
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('active')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    // Esc to close
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeSearch();
    }
  });

  // Expose openSearch globally for the button
  window.openSearch = openSearch;
})();
