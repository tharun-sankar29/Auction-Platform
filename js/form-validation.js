document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {
        let valid = true;
        const inputs = form.querySelectorAll("input", "select", "textarea");

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                valid = false;
                input.reportValidity();
            }
        })
        // Add your form validation logic here
        if (!valid) {
            event.preventDefault();
        }
    })
    
})