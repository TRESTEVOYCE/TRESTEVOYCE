function submitHelpRequest() {
    // 1. Get the input values
    const subject = document.getElementById('help-subject').value;
    const message = document.getElementById('help-message').value;
    const btn = document.getElementById('help-submit-btn');

    // 2. Simple Validation
    if (subject.trim() === "" || message.trim() === "") {
        alert("Please fill in both the subject and your message.");
        return;
    }

    // 3. Visual Feedback (Loading state)
    const originalText = btn.innerText;
    btn.innerText = "Sending...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // 4. Simulate a server delay (1.5 seconds)
    setTimeout(() => {
        // Reset the button
        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.opacity = "1";

        // Clear the fields
        document.getElementById('help-subject').value = "";
        document.getElementById('help-message').value = "";

        // 5. Show your success toast
        showToast("Your message has been sent successfully!");
    }, 1500);
}

// Ensure you have a working showToast function as well
function showToast(message) {
    const toast = document.getElementById('message-toast');
    if (toast) {
        toast.querySelector('span').innerText = message;
        toast.classList.add('show');
        
        // Hide it after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}