app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

function showForm(form) {
    var loginForm = document.getElementById('login-form');
    var signupForm = document.getElementById('signup-form');
    if (form === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else if (form === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}
