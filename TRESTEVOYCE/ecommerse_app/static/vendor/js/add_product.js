document.addEventListener("DOMContentLoaded", () => {



    // Drop-zone image upload
    const dropZone = document.querySelector(".drop-zone");
    if (dropZone) {
        const fileInput = dropZone.querySelector('input[type="file"]');

        dropZone.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
                alert("File too large (max 10MB)");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                dropZone.innerHTML = `<img src="${event.target.result}" style="max-width:100%; max-height:200px;">`;
            };
            reader.readAsDataURL(file);
        });
    }

    // Tags input functionality
    const addTagBtn = document.querySelector(".add-tag-btn");
    const tagInput = document.querySelector('input[name="tags"]');
    if (addTagBtn && tagInput) {
        addTagBtn.addEventListener("click", () => {
            const tag = tagInput.value.trim();
            if(tag) {
                alert(`Tag added: ${tag}`);
                tagInput.value = "";
            }
        });
    }

});
