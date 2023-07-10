document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('token')) {
        window.location.href = '/';
        return;
    }
    const inputUsername = document.getElementById('username') as HTMLInputElement;
    const inputPassword = document.getElementById('password') as HTMLInputElement;
    const buttonLogin = document.getElementById('login-button') as HTMLButtonElement;

    buttonLogin.addEventListener('click', (e) => {
        e.preventDefault();
        const username = inputUsername.value;
        const password = inputPassword.value;

        // Faire une requête à l'API pour vérifier les informations de connexion
        const url = 'http://localhost:8000/api/login_check';
        const data = {
            username: username,
            password: password
        };

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                alert('Invalid username or password!');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Invalid username or password!');
        });
    });
});