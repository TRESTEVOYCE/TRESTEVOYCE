// Sidebar menu items
const menuItems = document.querySelectorAll('.sidebar ul.menu li');
const pageTitle = document.getElementById('page-title');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all
        menuItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        // Update page title
        pageTitle.textContent = item.textContent.trim();
    });
});

// ---------- Simple welcome toast notification ----------
window.addEventListener('load', () => {
    // Only show on dashboard page
    if (window.location.pathname === '/dashboard/') {
        const toast = document.createElement('div');
        toast.textContent = "Welcome back!";
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.color = 'white';
        toast.style.backgroundColor = 'rgba(0, 0, 16)';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '6px';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});

