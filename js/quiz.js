import { questions } from "./questions.js";


let questionId, question, answer, selection, time, score, questionsCorrect;
let interval, progressInterval

const quiz = document.querySelector('.quiz');

const startScreen = document.querySelector('.start-screen');
const startButton = document.querySelector('.start-screen button');

const answerScreen = document.querySelector('.answer-screen');

const questionScreen = document.querySelector('.questions');
const questionTitle = document.getElementById('question-title');
const submitButton = document.getElementById('submit');

const answerScreenTitle = document.querySelector('.answer-screen h1');
const answerScreenDetails = document.querySelector('.answer-screen h2');
const answerScreenButton = document.querySelector('.answer-screen button');

const endScreen = document.querySelector('.end-screen');
const endScreenTitle = document.querySelector('.end-screen h1');
const endScreenDetails = document.querySelector('.end-screen h3');
const endScreenButton = document.querySelector('.end-screen button')

const progressBar = document.getElementById("progress-bar");

const scoreText = document.querySelector(".score");


// start screen
questionScreen.style.display = 'none';
answerScreen.style.display = 'none';
endScreen.style.display = 'none';
startScreen.style.display = 'block';

quiz.style.backgroundColor = "#3a9eb7";

// randomise questions
let completedQuestions = [];
const randomiseId = () => {
  let id;
  do {
    id = Math.floor(Math.random() * questions.length);
  } while (completedQuestions.includes(id))
  completedQuestions.push(id);
  return id;
}

startButton.onclick = () => {
  // animation
  setTimeout(() => {
    startButton.style.marginTop = "190px";
    startButton.style.backgroundColor = "#3a9eb7";
    startButton.style.width = "90%";
    setTimeout(() => startButton.innerText = "Enter", 100)
    quiz.style.backgroundColor = "white";
    document.querySelector('.start-screen h1').style.opacity = '0';
    document.querySelector('.start-screen h3').style.opacity = '0';

    setTimeout(() => {
      score = 0;
      questionsCorrect = 0;
      questionId = randomiseId();
      startQuestion();
    }, 210)
  }, 35)
}

// timer & progress bar
const startInterval = () => {
  time = 8;
  document.getElementById("quiz-timer").innerText = time;
  interval = setInterval(() => {
    time--;
    if (time === 0) {
      if (selection) {
        animation(selection === answer);
      } else {
        animation(false);
      }
    }
    document.getElementById("quiz-timer").innerText = time;
  }, 1000)
}
let progress;
const startProgressBarAnimation = () => {
  progress = 800;
  let color = "#3a9eb7";
  progressInterval = setInterval(() => {
    if (time <= 2) {
      color = "#F92A53";
    } else if (time <= 4) {
      color = "#FFB300";
    }
    progress--
    progressBar.style.background = `conic-gradient(${color} ${(progress / 800) * 360}deg, #ededed 0deg)`;
    document.getElementById("quiz-timer").style.color = color;
  }, 10)
}

// question screen
const startQuestion = () => {
  quiz.style.backgroundColor = 'white';
  answerScreen.style.display = 'none';
  startScreen.style.display = 'none';
  endScreen.style.display = 'none';
  questionScreen.style.display = 'block';
  scoreText.innerText = `Score: ${score}`;

  question = questions[questionId];
  answer = question.answer;
  time = 10;

  startInterval();
  startProgressBarAnimation();

  submitButton.classList.add('no-selection')

  questionTitle.innerText = question.name;
  // set options & selection functionality
  for (let i = 1; i <= 4; i++) {
    let option = document.getElementById(`option${i}`);
    option.innerText = question.options[i - 1];
    for (let j = 1; j <= 4; j++) document.getElementById(`option${j}`).classList.remove('selected');
    option.onclick = () => {
      if (selection === i) {
        option.classList.remove('selected');
        submitButton.classList.add('no-selection')
        selection = null;
      } else {
        submitButton.classList.remove('no-selection')
        for (let j = 1; j <= 4; j++) document.getElementById(`option${j}`).classList.remove('selected');
        selection = i;
        option.classList.add('selected');
      }
    }
  }
}


// submit answer
submitButton.onclick = () => { if (selection) animation(selection === answer) }

// answer screen
let timeout;
const animation = (isCorrect) => {
  clearInterval(interval);
  clearInterval(progressInterval);
  questionScreen.style.display = 'none';
  answerScreen.style.display = 'block';
  quiz.style.backgroundColor = isCorrect ? "#50C878" : "#e32636";

  const icon = document.querySelector('.answer-screen .material-symbols-outlined');
  icon.innerText = isCorrect ? "check_circle" : "dangerous";

  if (!isCorrect) {
    icon.style.marginTop = '175px';
    answerScreenTitle.innerText = time <= 0 ? "No Time!" : "Wrong!"
    answerScreenDetails.innerText = `The answer is ${answer} (${question.options[answer - 1]})`
  } else {
    icon.style.marginTop = '200px';
    answerScreenTitle.innerText = "Correct!";
    answerScreenDetails.innerText = "";
    questionsCorrect++
    if (progress === 1) score += 200; else score += progress + 200
  }
  document.querySelector('.answer-screen p').innerText = `Score: ${score}`;

  if (completedQuestions.length === questions.length) answerScreenButton.innerText = "See Results";
  else answerScreenButton.innerText = "Next Question";

  if (completedQuestions.length !== questions.length) {
    timeout = setTimeout(() => {
      questionId = randomiseId();
      selection = 0;
      startQuestion();
    }, isCorrect ? 1500 : 4000)

    answerScreenButton.onclick = () => {
      clearTimeout(timeout);
      questionId = randomiseId();
      selection = 0;
      startQuestion();
    }
  } else {
    timeout = setTimeout(() => endQuiz(), isCorrect ? 1500 : 4000)
    answerScreenButton.onclick = () => {
      clearTimeout(timeout);
      endQuiz();
    }
  }
}

// end screen
const endQuiz = () => {
  clearInterval(interval);
  clearInterval(progressInterval);

  answerScreen.style.display = 'none';
  questionScreen.style.display = 'none';
  endScreen.style.display = 'block';

  let color = "#00ff55";
  let message = "Well Done! You are able to identify appropriate methods to reduce stress."
  let margin = "150px"
  if (questionsCorrect <= (0.6 * questions.length)) {
    color = "#e32636";
    message = "It's alright, sometimes it's not easy to identify the appropriate ways to manage stress. Try to read up more on stress management."
    margin = "120px";
  } else if (questionsCorrect < (0.8 * questions.length)) {
    color = "yellow";
    message = "Good job, you are usually able to identify methods to reduce stress. However, you should still read up a bit more."
    margin = "120px";
  }

  document.querySelector(".quiz").style.backgroundColor = "#3a9eb7";

  endScreenTitle.innerText = `${questionsCorrect}/${questions.length}`
  document.querySelector('.end-screen h2').innerText = `Score: ${score}`
  endScreenTitle.style.color = color;
  endScreenTitle.style.marginTop = margin;
  endScreenDetails.innerText = message;
  if(score>localStorage.getItem("personalBest")){
  localStorage.setItem("personalBest",score)}
  document.getElementById("highscore").innerHTML = "Personal Best: " + localStorage.getItem("personalBest");
  
  