// Function to redirect to the home page
function closeDisplay() {
    window.location.href = 'home.html';
}

// Optional: If you want to go back to a specific section like Shop
function goToShop() {
    window.location.href = 'home.html#shop-all';
}

document.addEventListener('DOMContentLoaded', () => {
    const saveButtons = document.querySelectorAll('.btn-save-settings');

    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 1. Visual Feedback: Change button state
            const originalText = this.innerText;
            this.innerText = "Saving...";
            this.disabled = true;
            this.style.opacity = "0.7";

            // 2. Simulate API Call (1 second delay)
            setTimeout(() => {
                this.innerText = originalText;
                this.disabled = false;
                this.style.opacity = "1";
                
                // 3. Show Success Message
                showToast("Settings updated successfully!");
            }, 1000);
        });
    });
});