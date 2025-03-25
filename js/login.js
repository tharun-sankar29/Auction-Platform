document.addEventListener('DOMContentLoaded', () => {

    const SignInForm = document.getElementById('sign-in-form');
    const SignUpForm = document.getElementById('sign-up-form');

    SignInForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-passowrd').value;

        try {
            const res = await fetch('/login', {
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({email, password})
            })

            const data = await res.json();

            if(res.ok) {
                alert(res.text());
                localStorage.setItem('isLoggedIn', "true");
                window.location.href('home.html');

            } else {
                alert(res.text());
            }
        } catch (err) {
            console.log('Login Failed...');
            console.error(Error);
        }

    });

    SignUpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('register-name');
        const email = document.getElementById('register-email');
        const password = document.getElementById('register-password');

        try {
            const res = fetch('/register', {
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({name , email, password})
            })

            const data = await res.json();

            if(res.ok) {
                console.log('New user added...');
                alert('Registered Successfully');
            } else {
                console.error('New user not Added...');
                alert('Sorry Somethign Went Wrong, Please Try Again later...');
            }
        } catch (error) {
            console.error('New User Register Error...');
        }

    });

});