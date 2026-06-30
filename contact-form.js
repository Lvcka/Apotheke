// contact-form.js - Handle Contact Form Submission

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Hide previous message
            formMessage.style.display = 'none';

            // Prepare data
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };

            // Send to PHP endpoint
            fetch('send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                formMessage.style.display = 'block';
                
                if (data.success) {
                    formMessage.className = 'success';
                    formMessage.textContent = 'Wiadomość wysłana pomyślnie! Dziękujemy za kontakt.';
                    contactForm.reset();
                } else {
                    formMessage.className = 'error';
                    formMessage.textContent = 'Błąd: ' + data.message;
                }
            })
            .catch(error => {
                formMessage.style.display = 'block';
                formMessage.className = 'error';
                formMessage.textContent = 'Błąd komunikacji: ' + error.message;
            });
        });
    }
});
