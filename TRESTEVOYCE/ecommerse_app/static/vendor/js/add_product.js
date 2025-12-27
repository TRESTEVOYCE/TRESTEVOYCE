// Add Product JS
document.addEventListener("DOMContentLoaded", () => {
    // Drop-zone functionality
    const dropZone = document.querySelector(".drop-zone");
    if (dropZone) {
        dropZone.addEventListener("click", () => {
            alert("File upload clicked! Implement your file input here.");
        });
    }

    // Add tag button
    const addTagBtn = document.querySelector(".add-tag-btn");
    const tagInput = document.querySelector('input[name="tags"]');
    if (addTagBtn && tagInput) {
        addTagBtn.addEventListener("click", () => {
            const tag = tagInput.value.trim();
            if(tag) {
                alert(`Added tag: ${tag}`);
                tagInput.value = "";
            }
        });
    }
});
