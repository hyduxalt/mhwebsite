import questions from './symptomQuestions.js'

let questionId, question, questionNumber, selection, score;

const symptomChecker = document.querySelector('.symptom-checker');
const questionScreen = document.querySelector('.questions');
const methodsScreen = document.querySelector('.methods-screen');
const endScreen = document.querySelector('.end-screen');
const startScreen = document.querySelector('.start-screen');

const startButton = document.querySelector('.start-screen button');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const questionTitle = document.getElementById('question-title');

const progress = document.querySelector('.progress-report');

// start screen
questionNumber = 0;
questionScreen.style.display = 'none';
endScreen.style.display = 'none';
startScreen.style.display = 'block';
symptomChecker.style.backgroundColor = "#3a9eb7";

// progress circles
for (let i = 1; i <= questions.length; i++) {
  progress.innerHTML += `<span class="progress-point" id=${i}><span>`
}

// randomise questions
let completedQuestions = [];
let selectedOptions = [];
const randomiseId = () => {
  let id;
  do {
    id = Math.floor(Math.random() * questions.length);
  } while (completedQuestions.includes(id))
  completedQuestions.push(id);
  questionNumber++;
  return id;
}

const startButtonAnimation = () => {
  // animation
  setTimeout(() => {
    startButton.style.marginTop = "185px";
    startButton.style.marginBottom = "5px";
    startButton.style.width = "97%";
    startButton.style.opacity = "0.5";
    startButton.style.backgroundColor = "#3a9eb7";
    startButton.style.borderRadius = "25px"
    symptomChecker.style.backgroundColor = "white";
    document.querySelector('.start-screen h1').style.opacity = '0';
    document.querySelector('.start-screen h3').style.opacity = '0';

    setTimeout(() => {
      score = 0;
      questionId = randomiseId();
      startQuestion(questionId);
    }, 210)
  }, 35)
}
startButton.onclick = startButtonAnimation;

// question screen
const startQuestion = (id) => {

  symptomChecker.style.backgroundColor = 'white';
  startScreen.style.display = 'none';
  endScreen.style.display = 'none';
  questionScreen.style.display = 'block';

  question = questions[id];

  next.classList.add('no-selection')

  questionTitle.innerText = `${questionNumber}. ${question.name}`;
  // set options & selection functionality
  for (let i = 1; i <= 4; i++) {
    let option = document.getElementById(`option${i}`);
    option.innerText = question.options[i - 1];
    for (let j = 1; j <= 4; j++) document.getElementById(`option${j}`).classList.remove('selected');
    option.onclick = () => {
      if (selection === i) {
        option.classList.remove('selected');
        next.classList.add('no-selection')
        selection = null;
        document.getElementById(questionNumber).innerText = "";
      } else {
        next.classList.remove('no-selection')
        for (let j = 1; j <= 4; j++) document.getElementById(`option${j}`).classList.remove('selected');
        selection = i;
        option.classList.add('selected');
        document.getElementById(questionNumber).innerText = i;
      }
    }
  }

  // progress circles
  for (let i = 1; i <= questions.length; i++) {
    document.getElementById(i).classList.remove('current-question');
  }
  document.getElementById(questionNumber).classList.add('current-question');
  for (let i = 1; i <= selectedOptions.length; i++) {
    document.getElementById(i).innerText = selectedOptions[i - 1];
  }

  // check if there is a previous response
  if (selectedOptions.length >= questionNumber) {
    next.classList.remove('no-selection')
    for (let j = 1; j <= 4; j++) document.getElementById(`option${j}`).classList.remove('selected');
    selection = selectedOptions[questionNumber - 1];
    document.getElementById(`option${selectedOptions[questionNumber - 1]}`).classList.add('selected');
  }

  if (questionNumber === 1) {
    prev.classList.add('no-previous')
  } else {
    prev.classList.remove('no-previous');
  }

  if (questionNumber === questions.length) next.innerText = "Results";
  else next.innerText = "Next";
}

const nextButton = () => {
  if (!next.classList.contains('no-selection')) {
    if (questions.length !== questionNumber) {
      if (questionNumber === completedQuestions.length) {
        selectedOptions[questionNumber - 1] = selection;
        questionId = randomiseId();
        selection = 0;
        startQuestion(questionId);
      } else {
        selectedOptions[questionNumber - 1] = selection;
        questionNumber++
        startQuestion(completedQuestions[questionNumber - 1])
      }
    } else {
      selectedOptions[questionNumber - 1] = selection;
      endQuiz();
    }
  }
}
next.onclick = nextButton;

const prevButton = () => {
  if (!prev.classList.contains('no-previous')) {
    questionNumber--
    startQuestion(completedQuestions[questionNumber - 1])
  }
}
prev.onclick = prevButton;

// end screen
const endQuiz = () => {
  questionScreen.style.display = 'none';
  endScreen.style.display = 'block';
  document.body.scrollTop = 0;

  // total score
  for (let i = 0; i < selectedOptions.length; i++) {
    let id = completedQuestions[i];
    score += Number(questions[id].points[selectedOptions[i] - 1])
  }
  document.getElementById("score").innerHTML = `You scored: ${score}/16`;

  const details = document.getElementById('details')
  if (score >= 13) {
    details.innerText = "Very good! Your mental health is in tip-top condition! Keep it up!"
  } else if (score >= 9) {
    details.innerText = "Although you generally have good mental health, try to adopt some of the methods and coping mechanisms offered."
  } else if (score >= 5) {
    details.innerText = "You may want to consider talking to a trusted adult or trying one of our coping mechanisms/methods to overcome challenges."
  } else {
    details.innerText = "You may be facing a serious mental health crisis. Contact a trusted adult or use one of the helplines in the 'Helplines' page to seek further help."
  }

  for (let i = 0; i < questions.length; i++) {
    let id = completedQuestions[i];
    let selection = selectedOptions[i];
    let points = questions[id].points[selection - 1]
    methodsScreen.innerHTML += `
      <div class="recommendation">
        <h2 class="subhead" style="font-weight: ${points < 2 ? "800" : "600"}">${i + 1}. ${questions[id].name}</h2>
        <h2 style="color: ${points ? (points === 2 ? "black" : "orange") : "#e32636"}">Selected: ${selection} (${questions[id].options[selection - 1]})</h2>
        <h3><span style="font-weight: ${points < 2 ? "800" : "400"}">${questions[id].methods[selection - 1]}</span></h3>
        <br><hr><br>
      </div>
    `
  }
}


// reset
const endscreenButton = () => {
  completedQuestions = [];
  selectedOptions = [];
  question = null;
  score = 0;
  questionNumber = 0;
  selection = null;
  for (let i = 1; i <= questions.length; i++) {
    document.getElementById(i).innerText = "";
    document.getElementById(i).classList.remove('current-question');
  }
  methodsScreen.innerHTML = `          
    <h1 id="score"></h2>
    <h3 id="details"></h3>
    <br>
    <h2 class="headline">Methods to Cope</h3>
  `
  questionId = randomiseId();
  startQuestion(questionId);
}
document.querySelector('.end-screen button').onclick = endscreenButton


// keyboard shortcuts and repeated code
document.body.onkeydown = e => {
  if (/[1-4]/.test(e.key)) {
    if (questionScreen.style.display === "block") {
      let option = document.getElementById(`option${e.key}`)
      if (selection === Number(e.key)) {
        option.classList.remove('selected');
        next.classList.add('no-selection')
        selection = null;
        document.getElementById(questionNumber).innerText = "";
      } else {
        next.classList.remove('no-selection')
        for (let j = 1; j <= 4; j++) document.getElementById(`option${j}`).classList.remove('selected');
        selection = Number(e.key);
        option.classList.add('selected');
        document.getElementById(questionNumber).innerText = Number(e.key);
      }
    }
  } else if (e.key === "Enter" || e.key === "ArrowRight") {
    if (questionScreen.style.display === "block") {
      // next button
      nextButton();
    } else if (endScreen.style.display === "block") {
      // end screen reset
      endscreenButton();
    } else if (startScreen.style.display === "block") {
      // start screen
      startButtonAnimation();
    }
  } else if (e.key === "ArrowLeft" && questionScreen.style.display === "block") {
    // prev button
    prevButton();
  }
}