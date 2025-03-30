const session = require('express-session');
const { User } = require('../../server/schema/schema');

//session initialization
app.use(session ({
    secret: 'User',
    resave: false,
    saveUninitialized: true
}));

//storing user id in session
app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
        req.session.userId = user._id;
    }
})
//finding that particular user data from mongoose
app.get('/public/html/profile.ejs.html', async (req,res) => {
    if(!req.session.userId) res.json('No such user');
    else {
        const userData = await User.findById(req.session.userId);
        res.render('/public/html/profile.ejs.html', {user: userData}); //user acts as object in profile.ejs.html
    }
})
//set up ejs view
app.set('view engine', 'ejs');

document.addEventListener('DOMContentLoaded', () => {

    const SignInForm = document.getElementById('sign-in-form');
    const SignUpForm = document.getElementById('sign-up-form');

    //  SIGN-IN FORM HANDLER
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

    //  SIGN-UP FORM HANDLER
    SignUpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('register-name').value;    // ✅ Use .value
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
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
                window.location.href = 'home.html';   
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
