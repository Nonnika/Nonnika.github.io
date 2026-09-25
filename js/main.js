/*=============== STICKY HEADER ===============*/
(function () {
    const header = document.querySelector('.header') || document.querySelector('.post-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }, { passive: true });
})();

/*=============== 入场动画（IntersectionObserver 渐进增强） ===============*/
(function () {
    const targets = document.querySelectorAll(
        '.card-item, .card-year-section, .card-index-header, ' +
        '.archive-list li, .post-main-title, .page-title, .page-body, ' +
        'article.post-main, .paginator'
    );
    if (!targets.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return;

    // 视口内的元素加上级联延迟后立即显示，视口外的进入时再显示
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const siblings = entry.target.parentElement ?
                Array.from(entry.target.parentElement.children).filter(function (el) {
                    return el.classList.contains('reveal');
                }) : [];
            const index = Math.max(0, siblings.indexOf(entry.target));
            entry.target.style.setProperty('--reveal-delay', (Math.min(index, 7) * 0.07) + 's');
            entry.target.classList.add('reveal-in');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    const viewportH = window.innerHeight;
    targets.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportH) return; // 首屏内不做隐藏，避免闪烁
        el.classList.add('reveal');
        observer.observe(el);
    });
})();

/*=============== 阅读进度条（仅文章页） ===============*/
(function () {
    const isPost = document.querySelector('.post-main-title');
    if (!isPost) return;

    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let ticking = false;
    function update() {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const progress = max > 0 ? doc.scrollTop / max : 0;
        bar.style.transform = 'scaleX(' + progress + ')';
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
    update();
})();

/*=============== 返回顶部 ===============*/
(function () {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', '返回顶部');
    btn.title = '返回顶部';
    btn.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let ticking = false;
    function update() {
        btn.classList.toggle('visible', window.scrollY > 600);
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
    update();
})();
