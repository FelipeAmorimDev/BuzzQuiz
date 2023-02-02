/* Buscar quizzes servidor */

let qntRespostaCorreta = 0;
let qntPerguntasRespondida = 0;
let qntPerguntas = 0;
let levels = null;

const quizList = document.querySelector('.all-quiz__list')
const tela01 = document.querySelector('.tela1')
const tela02 = document.querySelector('.tela2')
const headerTela2 = document.querySelector('.header__tela2')
const perguntasContainer = document.querySelector('.perguntas__container')
const resultadoContainer = document.querySelector('.resultado-container')

const buscarQuizzesServidor = () => {
  const request = axios("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes")
  request.then(response => {
    adicionarQuizzNaLista(response.data)
  })
}

const adicionarQuizzNaLista = (quizzes) => {
  quizzes.forEach(item => {
    const quizzTemplate = `<div class="quizz" onclick="acessarQuizz(${item.id})">
  <img src="${item.image}" class="quizz-img">
  <div class="quizz-overlayer"></div>
  <h2>${item.title}</h2>
  </div>`
    quizList.innerHTML += quizzTemplate
  })
}

const acessarQuizz = id => {
  const request = axios(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`)
  request.then(response => {
    generatePage2Html(response.data, id)
  })
  tela01.classList.add('hidden')
  tela02.classList.remove('hidden')
}

const generatePage2Html = (data, id) => {
  const questions = data.questions
  levels = data.levels
  qntPerguntas = data.questions.length

  headerTela2.dataset.quizzid = id

  scrollTo(0, 0)

  limparDadosPage2()
  gerarHeaderPage2(data)
  gerarHtmlPerguntas(questions)
}

const limparDadosPage2 = () => {
  qntRespostaCorreta = 0;
  qntPerguntasRespondida = 0;
  perguntasContainer.innerHTML = '';
  resultadoContainer.innerHTML = '';
}

const gerarHeaderPage2 = (data) => {
  const headerTemplate = `<img src="${data.image}" alt="">
  <div class="tela2__overlayer"></div>
  <h2>${data.title}</h2>`

  headerTela2.innerHTML = headerTemplate;
}

const gerarHtmlPerguntas = (questions) => {
  questions.forEach((question, index) => {
    const questionTemplate = `<div class="pergunta pergunta-${index}">
    <div class="pergunta__title" style="background-color:${question.color}">
      <h3>${question.title}</h3>
    </div>
    <div class="pergunta__respostas"></div>
    </div>`

    perguntasContainer.innerHTML += questionTemplate
    gerarHtmlRespostas(question, index)
  })
}

const gerarHtmlRespostas = (question, index) => {
  let respostasArray = [];

  question.answers.forEach(resposta => {
    const respostaTemplate = `<div onclick="respostaSelecionada(this,${resposta.isCorrectAnswer})">
    <img src="${resposta.image}" alt="">
    <h4>${resposta.text}</h4>
  </div>`
    respostasArray.push(respostaTemplate)
  })

  embaralharRespostas(respostasArray, index)
}

const embaralharRespostas = (array, index) => {
  const respostas = document.querySelectorAll('.pergunta__respostas')

  array.sort(() => Math.random() - 0.5)

  const respostasEmbaralhadas = array.reduce((total, item) => total + item)
  respostas[index].innerHTML += respostasEmbaralhadas
  array = []
}

const respostaSelecionada = (resposta, estaCorreta) => {
  qntPerguntasRespondida++

  if (estaCorreta) {
    qntRespostaCorreta++;
  }

  bloquearQuestoesRespondidas(resposta);
  scrollarParaProximaPergunta(resposta);
  

  // Resultado quizz
  if (qntPerguntasRespondida === qntPerguntas) {
    const porcentagemAcerto = Math.ceil(qntRespostaCorreta / qntPerguntasRespondida * 100)

    for (let i = 0; i < levels.length; i++) {
      const minValue = levels[i].minValue
      gerarHTMLResultado(porcentagemAcerto, minValue, i)
    }
  }
}

const bloquearQuestoesRespondidas = (resposta) => {
  const respostasNode = resposta.parentElement.children;
  
  for (let i = 0; i < respostasNode.length; i++) {
    if (respostasNode[i] != resposta) {
      respostasNode[i].classList.add('bloqueada')
    }

    const estaCorreta = respostasNode[i].getAttribute('onclick').indexOf('true') != -1
    if (estaCorreta) {
      respostasNode[i].classList.add('certa')
    } else {
      respostasNode[i].classList.add('errada')
    }
    respostasNode[i].removeAttribute("onclick")
  }
} 

const scrollarParaProximaPergunta = (resposta) => {
  let proximaPergunta = resposta.parentElement.parentElement.nextElementSibling;
  if (proximaPergunta != null) {
    setTimeout(() => {
      proximaPergunta.scrollIntoView({ behavior: "smooth" })
    }, 2000)
  }
}

const gerarHTMLResultado = (porcentagemAcerto, minValue, index) => {
  if (porcentagemAcerto >= minValue) {
    const idQuizzAtual = headerTela2.dataset.quizzid
    const resultadoTemplate = `<div class="resultado-container__box">
    <div class="resultado-container__cabecalho">
      <h3>${porcentagemAcerto}% de acerto: ${levels[index].title}</h3>
    </div>
    <div class="resultado-container__conteudo">
      <img src="${levels[index].image}" alt="">
      <p>${levels[index].text}</p>
    </div>
    </div>
    <div class='botao__box'>
      <button onclick="acessarQuizz(${idQuizzAtual})">Reiniciar Quizz</button>
      <button onclick="retonarPaginaInicial()">Voltar pra home</button>
    </div>
    `
    resultadoContainer.innerHTML = resultadoTemplate

    setTimeout(() => {
      resultadoContainer.scrollIntoView({ behavior: "smooth" })
    }, 2000)

    return
  }
}

const retonarPaginaInicial = () => {
  document.location.reload();
}

buscarQuizzesServidor()
