// Fetch country codes from an API
async function fetchCountryCodes() {
    const countryCodeSelect = document.getElementById('countryCode');
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();

        // Clear initial "Loading..." option
        countryCodeSelect.innerHTML = '<option value="">Select Country Code</option>';

        countries.forEach((country) => {
            const code = country.idd?.root + (country.idd?.suffixes?.[0] || '');
            if (code) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${country.name.common} (${code})`;
                countryCodeSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error fetching country codes:', error);
        countryCodeSelect.innerHTML = '<option value="">Error loading codes</option>';
    }
}

// Handle form submission
async function sendMessage(event) {
    event.preventDefault();  // Prevent default form submission
    const message = document.getElementById('message').value.trim();
    const countryCode = document.getElementById('countryCode').value;
    const phone = document.getElementById('phone').value.trim();

    // Validate form fields
    if (!message || !countryCode || !phone) {
        alert('Please fill out all fields!');
        return;
    }

    // Concatenate country code with phone number to form full phone number
    const fullPhoneNumber = countryCode + phone;

    // Send message to backend API
    try {
        const response = await fetch('http://localhost:3005/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                phone: fullPhoneNumber,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const result = await response.json();
        alert(`Message sent successfully! Response: ${result.message || result.status}`);
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
    }
}

// Add event listeners on page load
document.addEventListener('DOMContentLoaded', () => {
    // Fetch country codes when the page loads
    fetchCountryCodes();

    // Add submit event listener for the form
    document.getElementById('messageForm').addEventListener('submit', sendMessage);
});
