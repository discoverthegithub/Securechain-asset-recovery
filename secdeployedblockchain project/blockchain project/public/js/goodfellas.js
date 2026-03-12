/* ============================================
   GOODFELLAS PAGE TRANSITION — Controller
   Intercepts nav clicks, plays wipe, navigates
   ============================================ */
(function () {
    'use strict';

    // Build the overlay DOM once
    var overlay = document.createElement('div');
    overlay.className = 'gf-transition-overlay';
    overlay.innerHTML =
        '<div class="gf-panel gf-panel-1"></div>' +
        '<div class="gf-panel gf-panel-2"></div>' +
        '<div class="gf-panel gf-panel-3"></div>' +
        '<div class="gf-brand">' +
            '<i class="fa-solid fa-shield-halved gf-brand-icon"></i>' +
            '<span class="gf-brand-text">SecureChain</span>' +
        '</div>';
    document.body.appendChild(overlay);

    // On page load — play the EXIT (reveal) animation
    window.addEventListener('load', function () {
        // If we arrived via a transition, the overlay should be covering the screen
        if (sessionStorage.getItem('gf-transitioning')) {
            sessionStorage.removeItem('gf-transitioning');
            overlay.classList.add('gf-exit');
            // Clean up after exit animation completes
            setTimeout(function () {
                overlay.classList.remove('gf-exit');
            }, 700);
        }
    });

    // Intercept all internal link clicks
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href]');
        if (!link) return;

        var href = link.getAttribute('href');

        // Skip hash-only links, external links, javascript: links, and same-page anchors
        if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('mailto:')) return;
        if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;

        // Skip same-page hash scrolling (like /#features, /#how-it-works)
        if (href.startsWith('/#') || (href.startsWith('#') && href.length > 1)) return;

        // Skip if the link is the current page
        var targetPath = new URL(href, window.location.origin).pathname;
        if (targetPath === window.location.pathname) return;

        // Prevent default navigation
        e.preventDefault();

        // Mark that we're transitioning (so the next page knows to play exit)
        sessionStorage.setItem('gf-transitioning', '1');

        // Play ENTER animation (panels sweep in)
        overlay.classList.remove('gf-exit');
        overlay.classList.add('gf-enter');

        // Navigate after panels fully cover the screen
        setTimeout(function () {
            window.location.href = href;
        }, 550);
    });

    // Also handle form submissions that redirect (login/register)
    // The transition will play on the next page load via sessionStorage
})();
