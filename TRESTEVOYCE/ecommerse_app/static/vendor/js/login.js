// LOGIN PAGE starts here --------------------

// Toggle between Customer and Vendor
const btnCustomer = document.getElementById('btn-customer');
const btnVendor = document.getElementById('btn-vendor');

btnCustomer.addEventListener('click', () => {
    btnCustomer.classList.add('active');
    btnVendor.classList.remove('active');
});

btnVendor.addEventListener('click', () => {
    btnVendor.classList.add('active');
    btnCustomer.classList.remove('active');
});

// Show/Hide password
const passwordInput = document.getElementById('password-input');
const toggleEye = document.getElementById('toggle-eye');

toggleEye.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleEye.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleEye.textContent = '👁️';
    }
});


// -----------------BASE JS Start Here ---------------- //

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
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
});
