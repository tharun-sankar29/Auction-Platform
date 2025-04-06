document.addEventListener('DOMContentLoaded', async () => {
    try {
        const resp = await fetch('/auth/session');
        
        if (!resp.ok) {
            alert('Session Expired Please Login..');
            window.location.href = 'loginAndRegister.html';
            return
        }
    } catch (err) {
        console.error('Error validating Session: ' + err);
        alert('Invalid Session');
    }



    function getLocalDateTimePlusMinutes(minutesOffset) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + minutesOffset);
        const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        return localTime.toISOString().slice(0, 16);
      }
  
      function validateProduct() {
        const name = document.getElementById('name').value.trim();
        const price = document.getElementById('price').value.trim();
        const description = document.getElementById('description').value.trim();
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
  
        function showErrorMessage(id, message) {
          const errorElement = document.getElementById(id);
          errorElement.textContent = message;
          errorElement.style.display = 'block';
        }
  
        function hideErrorMessage(id) {
          const errorElement = document.getElementById(id);
          errorElement.style.display = 'none';
          errorElement.textContent = '';
        }
  
        hideErrorMessage('name-error');
        hideErrorMessage('price-error');
        hideErrorMessage('description-error');
        hideErrorMessage('start-time-error');
        hideErrorMessage('end-time-error');

    
        const nameRegex = /^[A-Za-z0-9\s\-]+$/;
        if (!nameRegex.test(name)) {
            showErrorMessage('name-error', 'Product title can only contain letters, numbers, spaces, and hyphens.');
            return false;
        }
    
        if (price <= 0 || isNaN(price)) {
            showErrorMessage('price-error', 'Price must be a positive number.');
            return false;
        }
    
        if (description.length < 10) {
            showErrorMessage('description-error', 'Description must be at least 10 characters long.');
            return false;
        }
    
        if (new Date(startTime) >= new Date(endTime)) {
            showErrorMessage('end-time-error', 'End time must be later than start time.');
            return false;
        }
    
        return true;
      }
  
  
      const startTimeInput = document.getElementById('start-time');
      const endTimeInput = document.getElementById('end-time');
      const productForm = document.getElementById('productForm');
  
      startTimeInput.min = getLocalDateTimePlusMinutes(5);
      startTimeInput.addEventListener('change', () => {
        if (startTimeInput.value) {
          endTimeInput.min = startTimeInput.value;
        }
      });
  
      productForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (validateProduct()) {
          productForm.submit();
          }
    });
})