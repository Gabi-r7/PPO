let params = new URLSearchParams(window.location.search);
let ano = params.get('ano').split(',');
let tipo = params.get('tipo').split(',');
console.log(ano, tipo);
carregarPerguntas(ano, tipo);

let perguntas = null;
let indicePerguntaAtual = 0;

function carregarPerguntas(anos, tipos) {
    fetch('assets/json/sim_2023.json')
        .then(response => response.json())
        .then(data => {
            perguntas = [];
            for (let ano of anos) {
                for (let tipo of tipos) {
                    if (data[ano] && data[ano][tipo]) {
                        perguntas = perguntas.concat(...Object.values(data[ano][tipo]));
                    }
                }
            }
            atualizarPergunta();
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
}

let respostasDoUsuario = [];
let mainElement = document.querySelector('main');

function atualizarPergunta() {
    if (indicePerguntaAtual >= perguntas.length) {
        // Todas as perguntas foram respondidas
        alert('Você acabou!');
        let tabela = document.createElement('table');
        let cabecalho = tabela.createTHead();
        let linhaCabecalho = cabecalho.insertRow();
        linhaCabecalho.insertCell().textContent = 'Pergunta';
        linhaCabecalho.insertCell().textContent = 'Sua Resposta';
        linhaCabecalho.insertCell().textContent = 'Resposta Correta';

        perguntas.forEach((pergunta, index) => {
            let linha = tabela.insertRow();
            linha.insertCell().textContent = pergunta['Descrição'];
            linha.insertCell().textContent = pergunta['Alternativas'][respostasDoUsuario[index]];
            linha.insertCell().textContent = pergunta['Alternativas'][pergunta['Resposta']];
        });

        mainElement.innerHTML = '';
        mainElement.appendChild(tabela);
        console.log(respostasDoUsuario);
        return;
    }

    let pergunta = perguntas[indicePerguntaAtual];
    let descricao = pergunta['Descrição'];
    let descricaoAuxiliar = pergunta['DescriçãoAuxiliar'];
    let imagemAuxiliar = pergunta['ImagemAuxiliar'];
    let alternativas = pergunta['Alternativas'];

    // Limpar o conteúdo anterior
    mainElement.innerHTML = '';

    // Inserir no HTML ---------------------------------------------------------------------
    let div = document.createElement('div');
    let h3 = document.createElement('div');
    let numeroPergunta = indicePerguntaAtual + 1; // Adicionamos 1 porque os índices começam em 0
    let numeroPerguntaElement = document.createElement('h2');
    
    numeroPerguntaElement.classList.add('numeroPergunta'); //class

    numeroPerguntaElement.textContent = `${numeroPergunta} / ${perguntas.length}`;
    div.appendChild(numeroPerguntaElement);

    if (descricaoAuxiliar) {
        let p = document.createElement('p');
        p.textContent = descricaoAuxiliar;
        div.appendChild(p);
        p.classList.add('descricaoAuxiliar'); //class
    }

    if (imagemAuxiliar) {
        let img = document.createElement('img');
        img.src = imagemAuxiliar;
        div.appendChild(img);
        img.classList.add('imagemAuxiliar'); //class
    }
    
    h3.textContent = descricao;
    div.appendChild(h3);
    div.classList.add('questao'); //class
    h3.classList.add('pergunta'); //class

    let ul = document.createElement('ul');
    ul.classList.add('alternativas'); //class
    alternativas.forEach((alternativa, index) => {
        let label = document.createElement('label');
        label.classList.add('alternativa'); //class
        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'alternativa';
        radio.value = index;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(alternativa));
        ul.appendChild(label);
    });
    div.appendChild(ul);
    
    let botoes = document.createElement('div');
    div.appendChild(botoes);
    let buttonPrevious = document.createElement('span');
    botoes.appendChild(buttonPrevious);
    botoes.classList.add('botoes'); //class

    buttonPrevious.classList.add('previous'); //class
    buttonPrevious.textContent = 'Pergunta Anterior';
    buttonPrevious.addEventListener('click', function() {
        let selectedOption = document.querySelector('input[name="alternativa"]:checked');
        if (selectedOption === null) {
            alert('Selecione uma alternativa para continuar');
        }
        if (selectedOption && indicePerguntaAtual > 0) {
            respostasDoUsuario[indicePerguntaAtual] = parseInt(selectedOption.value);
            perguntaAnterior();
        }
    });

    let buttonNext = document.createElement('span');
    botoes.appendChild(buttonNext);
    buttonNext.classList.add('next'); //class
    buttonNext.textContent = 'Próxima pergunta';
    buttonNext.addEventListener('click', function() {
        let selectedOption = document.querySelector('input[name="alternativa"]:checked');
        if (selectedOption === null) {
            alert('Selecione uma alternativa para continuar');
        }
        if (selectedOption) {
            respostasDoUsuario[indicePerguntaAtual] = parseInt(selectedOption.value);
            proximaPergunta();
        }
    });
    
    mainElement.appendChild(div);
}

function proximaPergunta() {
    indicePerguntaAtual++;
    atualizarPergunta();
}

function perguntaAnterior() {
    indicePerguntaAtual--;
    atualizarPergunta();
}