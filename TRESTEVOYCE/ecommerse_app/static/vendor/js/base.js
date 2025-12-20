// ---------- Sidebar menu active highlight ----------
const menuItems = document.querySelectorAll('.sidebar ul.menu li');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// ---------- Simple welcome toast notification ----------
window.addEventListener('load', () => {
    const toast = document.createElement('div');
    toast.textContent = "Welcome back!";
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.color = 'black';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
});
