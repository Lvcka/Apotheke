document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const headerCenter = document.querySelector('.header-center');

    if (!menuToggle || !headerCenter) {
        return;
    }

    menuToggle.addEventListener('click', function () {
        headerCenter.classList.toggle('open');
        const isOpen = headerCenter.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.header-center nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (headerCenter.classList.contains('open')) {
                headerCenter.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
});
