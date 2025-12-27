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
