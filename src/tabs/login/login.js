import { showModal } from '../../assets/js/nav.js';

document.getElementById('login-form').addEventListener('submit', async (event) => {
    console.log('entrou');
    event.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const data = { login, password };

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const responseJson = await response.json();
    if (responseJson.status === 'success') {
        showModal(responseJson);
        window.location.href = '/src/tabs/home/index.html';
    }
    else {
        alert(responseJson.message);
    }
});