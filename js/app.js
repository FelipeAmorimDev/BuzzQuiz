/* Buscar quizzes servidor */

const quizList = document.querySelector('.all-quiz__list')
const tela01 = document.querySelector('.tela1')
const tela02 = document.querySelector('.tela2')

const perguntasContainer = document.querySelector('.perguntas__container')

let questionTemplate = ``;

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
    console.log(response.data)
    generatePage2Html(response.data)
  })

  tela01.classList.add('hidden')
  tela02.classList.remove('hidden')
}

const generatePage2Html = data => {
  let respostasArray = [];
  const headerTela2 = document.querySelector('.header__tela2')
  const headerTemplate = `<img src="${data.image}" alt="">
  <div class="tela2__overlayer"></div>
  <h2>${data.title}</h2>`
  headerTela2.innerHTML = headerTemplate;

  const questions = data.questions
  questions.forEach((question,index) => {
    questionTemplate = `<div class="pergunta">
    <div class="pergunta__title" style="background-color:${question.color}">
    <h3>${question.title}</h3>
    </div>
    <div class="pergunta__respostas">
      
    </div>
    </div>`
    perguntasContainer.innerHTML += questionTemplate

    const respostas = document.querySelectorAll('.pergunta__respostas')
    question.answers.forEach(resposta => {
      const respostaTemplate = `<div>
      <img src="${resposta.image}" alt="">
      <h4>${resposta.text}</h4>
    </div>`
      respostasArray.push(respostaTemplate)
      
    })
    respostasArray.sort( () => Math.random() - 0.5)
    console.log(respostasArray)
    const respostasEmbaralhadas = respostasArray.reduce((total,item) => total + item)
    respostas[index].innerHTML += respostasEmbaralhadas
    respostasArray = []

})

}

buscarQuizzesServidor()


