/* Buscar quizzes servidor */

const quizList = document.querySelector('.all-quiz__list')

const buscarQuizzesServidor = () => {
  const request = axios("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes")
  request.then(response => {
    adicionarQuizzNaLista(response.data)
  })
}

const adicionarQuizzNaLista = (quizzes) => {
  quizzes.forEach(item => {
    const quizzTemplate = `<div class="quizz">
  <img src="${item.image}" class="quizz-img">
  <div class="quizz-overlayer"></div>
  <h2>${item.title}</h2>
  </div>`
  quizList.innerHTML+= quizzTemplate
  })
 }

buscarQuizzesServidor()