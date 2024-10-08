// Função para fazer a requisição ao backend
document.addEventListener('DOMContentLoaded', getUsers);
let responseJson = {};
async function getUsers() {
    const response = await fetch('/getUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    responseJson = await response.json();
    console.log(responseJson);
    if (responseJson.status != 'error') {
        sortUser();
    }
    else {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/login/login.html';
        }, 700);
    }
};
let filter = document.getElementById('filtro');
filter.addEventListener('input', () => {
    sortUser();
});
function sortUser() {
    let filterOp;

    if (filter.value == 'Acertos') {
        responseJson.users.sort((a, b) => b.correct_answers - a.correct_answers);
        filterOp = 'Acertos';
    }
    else if (filter.value == 'Erros') {
        responseJson.users.sort((a, b) => b.wrong_answers - a.wrong_answers);
        filterOp = 'Erros';
    }
    else if (filter.value == 'Respondidas') {
        responseJson.users.sort((a, b) => (b.correct_answers + b.wrong_answers) - (a.correct_answers + a.wrong_answers));
        filterOp = 'Respondidas';
    }
    else {
        responseJson.users.sort((a, b) => b.experience - a.experience);
        filterOp = 'Experiência';
    }

    let rankingList = document.getElementById('ranking-list');

    rankingList.innerHTML = `<div class="border legenda-ranking linha">
                    <div class="coluna legendas">Perfil</div>
                    <div class="coluna legendas">Posição</div>
                    <div class="coluna legendas">Nome</div>
                    <div class="coluna experience legendas">EXP</div>
                    <div class="coluna correct-answers legendas">Acertos</div>
                    <div class="coluna wrong-answers legendas">Erros</div>
                    <div class="coluna border-right answered-questions legendas">Respostas</div>
                </div>`;

    let podium = document.createElement('div');
    podium.classList.add('podium');
    let podiumHeader = document.createElement('div');
    podiumHeader.classList.add('podium-header');
    podiumHeader.innerHTML = `Pódio`;
    podium.appendChild(podiumHeader);
    rankingList.appendChild(podium);

    let outher = document.createElement('div');
    outher.classList.add('outher');
    let outherHeader = document.createElement('div');
    outherHeader.classList.add('outher-header');
    outherHeader.innerHTML = `Outros`;
    outher.appendChild(outherHeader);
    rankingList.appendChild(outher);

    responseJson.users.forEach((user, index) => {

        let userElement = document.createElement('div');
        userElement.classList.add('linha');
        userElement.classList.add('secondary-div');

        if(responseJson.users.length - 1 == index) {
            userElement.classList.remove('border');
        }

        userElement.innerHTML = `
        <div class="imgProfile coluna"><img src="${user.profileImage}"></img></div>
        <div class="position coluna">${index + 1}</div>
        <div class="name coluna">${user.login}</div>
        <div class="experience coluna">${user.experience}</div>
        <div class="correct-answers coluna">${user.correct_answers}</div>
        <div class="wrong-answers coluna">${user.wrong_answers}</div>
        <div class="answered-questions coluna border-right">${user.correct_answers + user.wrong_answers}</div>
        `;
        
        if(index < 3) {
            if(index == 0) {
                userElement.classList.add('first');
            }
            if(index == 1) {
                userElement.classList.add('second');
            }
            if(index == 2) {
                userElement.classList.add('third');
            }

            podium.appendChild(userElement);
        }
        else{
            outher.appendChild(userElement);
        }
    });

    const filterText = document.getElementById('filter-text');
    filterText.innerHTML = 'Filtrando por ';
    
    const legendas = document.querySelectorAll('.legendas');
    legendas.forEach((legenda, index) => {
        legenda.classList.remove('selected');
        legenda.classList.remove('border-right');

        if(index == legendas.length - 1) {
            legenda.classList.add('border-right');
        }
    });

    if (filterOp == 'Acertos') {
        filterText.innerHTML += 'acertos';
    }
    else if (filterOp == 'Erros') {
        filterText.innerHTML += 'erros';
    }
    else if (filterOp == 'Respondidas') {
        filterText.innerHTML += 'respondidas';
    }
    else {
        filterText.innerHTML += 'experiência';
    }
};