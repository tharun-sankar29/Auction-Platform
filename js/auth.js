document.addEventListener('DOMContentLoaded', () => {

    const SignInForm = document.getElementById('sign-in-form');
    const SignUpForm = document.getElementById('sign-up-form');

    // ✅ SIGN-IN FORM HANDLER
    SignInForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // ✅ Await res.text() or res.json() properly
            const data = await res.json();  

            if (res.ok) {
                alert(data.message || 'Login successful!');  
                localStorage.setItem('isLoggedIn', "true");
                window.location.href = 'home.html';  // ✅ Correct redirection syntax
            } else {
                alert(data.error || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login Failed...', err);
            alert('Something went wrong. Please try again later.');
        }
    });

    // ✅ SIGN-UP FORM HANDLER
    SignUpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('register-name').value;    // ✅ Use .value
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            // ✅ Add await before fetch
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();  

            if(res.status === 409) {
                alert(data.message || 'User already exists. Please log in.');
                console.log('User already exists...');
            } else if (res.ok) {
                console.log('New user added...');
                alert(data.message || 'Registered Successfully');
                window.location.href = 'home.html';   // Redirect after successful registration
            } else {
                console.error('New user not added...');
                alert(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('New User Register Error...', error);
            alert('Failed to register. Please try again later.');
        }
    });

});
