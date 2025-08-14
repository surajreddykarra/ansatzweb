document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navItems = document.getElementById('nav-items');

    if (menuToggle && navItems) {
        menuToggle.addEventListener('click', () => {
            navItems.classList.toggle('active');
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);

            // Optional: Change icon from bars to X and back
            const icon = menuToggle.querySelector('i');
            if (navItems.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Change to 'X' icon
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // Change back to bars icon
            }
        });

        // Optional: Close menu when a link is clicked (if needed)
        document.querySelectorAll('#nav-items li a').forEach(link => {
            link.addEventListener('click', () => {
                if (navItems.classList.contains('active')) {
                    navItems.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const navItems = document.getElementById('nav-items');
  menuToggle.addEventListener('click', function() {
    navItems.classList.toggle('active');
    menuToggle.setAttribute(
      'aria-expanded',
      navItems.classList.contains('active') ? 'true' : 'false'
    );
  });
});