  const customerBtn = document.getElementById('customerBtn');
    const vendorBtn = document.getElementById('vendorBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const loginForm = document.getElementById('loginForm');

    // Customer Selection Logic
    customerBtn.addEventListener('click', () => {
      customerBtn.classList.add('active');
      vendorBtn.classList.remove('active');
      welcomeMessage.innerText = 'Sign in to continue shopping';
    });

    // Vendor Selection Logic
    vendorBtn.addEventListener('click', () => {
      vendorBtn.classList.add('active');
      customerBtn.classList.remove('active');
      welcomeMessage.innerText = 'Sign in to manage your shop';
    });

    // Password toggle logic
    document.getElementById('togglePassword').addEventListener('click', function() {
      const passwordField = document.getElementById('password');
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);
    });

    // Redirection Logic: Redirects to home.html on successful Customer login
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (customerBtn.classList.contains('active')) {
        window.location.href = 'wishlist.html'; // Adjust to your actual shop filename
      } else {
        alert("Vendor Dashboard coming soon!");
      }
    });