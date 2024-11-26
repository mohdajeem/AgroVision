document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    fetch('http://localhost:3000/send-message', { // Update with your backend URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Failed to send message');
            });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // Show success message
        document.getElementById('contact-form').reset(); // Reset form on success
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert('Failed to send message: ' + error.message);
    });
});
