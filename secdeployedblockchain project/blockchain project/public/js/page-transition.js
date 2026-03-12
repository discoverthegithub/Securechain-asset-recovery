/* ======= GOODFELLAS PAGE TRANSITION ======= */
(function () {
    var overlay = document.createElement('div');
    overlay.className = 'gf-transition';
    overlay.innerHTML = '<div class="gf-panel"></div><div class="gf-brand"><i class="fas fa-shield-alt"></i> SecureChain</div>';
    document.body.appendChild(overlay);

    // Panel is VISIBLE by default (CSS). Wipe it away to reveal page content.
    requestAnimationFrame(function () {
        overlay.classList.add('revealing');
        setTimeout(function () {
            overlay.classList.remove('revealing');
            overlay.classList.add('hidden');
        }, 450);
    });

    // On link click: show panel instantly, then navigate
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link) return;

        var href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') return;
        if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;

        var url = new URL(href, window.location.origin);
        if (url.pathname === window.location.pathname && url.hash) return;

        e.preventDefault();
        overlay.classList.remove('hidden');
        overlay.classList.add('covering');

        setTimeout(function () {
            window.location.href = href;
        }, 150);
    });
})();
