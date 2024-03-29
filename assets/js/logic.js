import { questions } from "./questions.js";

// select elements based on class and id from html
const startScreenElement = document.querySelector('#start-screen')
const endScreenElement = document.querySelector('#end-screen')
const startBtnElement = document.querySelector('#start')
const timerElement = document.querySelector('#time')
const questionElement = document.querySelector('#questions')
const questionTitleElement = document.querySelector('#question-title')
const questionChoicesElement = document.querySelector('#choices')
const feedbackElement = document.querySelector('#feedback')
const finalScoreElement = document.querySelector('#final-score')
const initialsElement = document.querySelector('#initials')
const submitBtnElement = document.querySelector('#submit')
// const correctAnswerAudioElement = document.getElementById('correctAnswerAudio')
// const incorrectAnserAudioElement = document.getElementById('incorrectAnserAudio')

// Initializations 
let remainingTime = 100
let finalScore = 0
let timerInterval

// This is function for ending the quiz
function endQuiz() {
    questionElement.classList.add('hide')
    endScreenElement.classList.remove('hide')
    finalScoreElement.innerText = finalScore;
    remainingTime = 0;
}

timerElement.innerText = `${remainingTime}s`

// Function for updating timer
function updateTimer() {
    timerElement.innerText = `${remainingTime}s`

// condition for ending the quiz
    if(remainingTime <= 0) {
        clearInterval(timerInterval)
        endQuiz()
    } else{
        remainingTime -= 1;
    }
}

// EVentListener for start screen
startBtnElement.addEventListener('click', () => {
    startScreenElement.classList.add('hide')
    timerInterval = setInterval(updateTimer, 1000)
    updateTimer()

    
    const allQuestions = questions.map((questionObj, index) => {
        let currentQuestion = `Q${index + 1}. ${questionObj.question}` 
        let currentAnswerOptions = ""
        questionObj.options.forEach(option =>{
            currentAnswerOptions += `
             <li class = "single-option">${option}</li>
            ` 
        })
        return {currentQuestion, currentAnswerOptions}
    })
    const allCorrectAnswers = questions.map(questionObj => {
        return questionObj.answer
    })

    let currentQuestionIndex = 0;

    // function for displaying questions
    function displayQuestion() {
        questionElement.classList.remove('hide')
        questionTitleElement.innerText = allQuestions[currentQuestionIndex].currentQuestion
        questionChoicesElement.innerHTML = allQuestions[currentQuestionIndex].currentAnswerOptions;
    }
    displayQuestion();

    questionElement.addEventListener('click', (event) =>{
        if(event.target.classList.contains('single-option')) {
            questionElement.classList.add('hide');

            if(event.target.innerText === allCorrectAnswers[currentQuestionIndex]) {
                feedbackElement.classList.remove('hide') 
                feedbackElement.innerText = 'Correct Answer'
                finalScore += 1 
            } else {
                feedbackElement.classList.remove("hide")
                feedbackElement.innerText = 'Wrong Answer'
                remainingTime -= 10;
            }
            // conditional statement for displaying questions
            currentQuestionIndex +=1;
            if(currentQuestionIndex < allQuestions.length && remainingTime > 0) {
                displayQuestion();
            } else {
                endQuiz()
            }

        //  const correctAudio = new Audio('./assets/sfx/correct.wav')
        //  const incorrectAudio = new Audio('./assets/sfx/incorrect.wav')

        //  document.getElementById('start').addEventListener('click', function() {
        //     correctAudio.play()
        //  });

        //  document.getElementById('start').addEventListener('click', function() {
        //     incorrectAudio.play()
        //  });
            
        }
    })
})
    // EventListener on the submit button
submitBtnElement.addEventListener('click', () => {
    const highScoresData = JSON.parse(localStorage.getItem('highScores')) || {}
    const userInitials = initialsElement.value
    const userScoreData = {[userInitials]: finalScore}
    Object.assign(highScoresData, userScoreData)
    const updatedHighScores = JSON.stringify(highScoresData)
    localStorage.setItem('highScores', updatedHighScores)
    window.location.href = 'highscores.html';
})




