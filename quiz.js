const container = document.querySelector('.container');
const welcomeContainer = document.querySelector('.welcome-container');
const finishContainer = document.querySelector('.finish-container');
const question = document.querySelector('.question');
const category = document.querySelector('.category');
const choiceContainer = document.querySelector('.choice-container');
const nextBtn = document.querySelector('.next-btn');
const viewAnswerBtn = document.querySelector('.view-answer-btn');
const viewAnswer = document.querySelector('.view-answer');
const finishQuizBtn = document.querySelector('.finish-quiz-btn');
const disabledNextBtnWarning = document.querySelector('.disabledNextBtn-warning');

let rightAnswerCounter = [];
let currentIndex = 0;

displayWelcomeCard();

//handleQuestionData();

finishQuizBtn.addEventListener('click', () => {
  container.style.display = 'none';
  finishContainer.style.display = 'flex';
  finishContainer.innerHTML = `<h1>Congrats!</br> you answered <span>${rightAnswerCounter.length}/10</span> correctly.</h1>
  <h3 class="finish-msg">Wanna Play again? <button id="click-me-btn">Click me</button></h3>`;
  playAgain();
});

function playAgain() {
  const clickMeBtn = document.getElementById('click-me-btn');
  clickMeBtn.addEventListener('click', () => {
    location.reload();
  });
}

async function handleQuestionData(qcategory,difficulty,type) {
  const questionsArray = await getQuestions(qcategory,difficulty,type);
  displayQuestion();

  function displayQuestion() {
    if (currentIndex === questionsArray.length) {
      nextBtn.style.display = 'none';
      finishQuizBtn.style.display = 'inline-block';
    } else {
      const questionData = questionsArray[currentIndex].question;
      const categoryData = questionsArray[currentIndex].category;
      const correctAnswer = questionsArray[currentIndex].correct_answer;
      const incorrectAnswers = [...questionsArray[currentIndex].incorrect_answers]; // clone the array
      incorrectAnswers.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer);

      // Display the question and category
      question.innerHTML = `Q${currentIndex + 1}: ${questionData}`;
      category.innerHTML = `<span>Category:</span> <span>${categoryData}</span>`;
      choiceContainer.innerHTML = `${incorrectAnswers.map((item) => `<li class="choice">${item}</li>`).join(" ")}`;
      
      // Reset the button to disabled after loading a new question
      nextBtn.classList.add('disabled');
      disabledNextBtnWarning.style.display = 'none'; // Hide warning initially

      checkCorrectAnswer(correctAnswer);
    }
  }
  function checkCorrectAnswer(correctAnswer) {
    const choices = document.querySelectorAll('.choice');
    choices.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Mark correct and wrong answers
        if (item.innerText === correctAnswer) {
          item.classList.add('correct');
          rightAnswerCounter.push("1 point"); // Track the correct answers
        } else {
          item.classList.add('wrong');
          viewAnswerBtn.style.display = 'block';
        }
        // Disable clicks for the other choices
        choices.forEach((item) => {
            item.style.pointerEvents = 'none'; // Disable click
            item.style.opacity = '0.7'; // Visually appear disabled
        });

        viewAnswerBtn.addEventListener('click', () => {
          viewAnswer.innerHTML = `${correctAnswer}`;
          viewAnswer.style.display = 'block';
        });

        // Enable the next button when an answer is selected
        nextBtn.classList.remove('disabled');
        disabledNextBtnWarning.style.display = 'none';
      });
    });
  }
  // Add event listener to the "Next" button only once
  nextBtn.addEventListener('click', () => {
    if (nextBtn.classList.contains('disabled')) {
      disabledNextBtnWarning.style.display = 'block'; // Show warning if the button is still disabled
    } else {
      currentIndex++;
      displayQuestion();
      hideElements(); // Reset elements when moving to the next question
    }
  });
}

function displayWelcomeCard(){
  const startQuizBtn = document.querySelector('.startquiz-btn');
  startQuizBtn.addEventListener('click', () => {
    welcomeContainer.classList.remove('welcome-container');
    
    container.style.display = "flex";
    const qcategory = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    //console.log(questionCategory);
    handleQuestionData(qcategory,difficulty,type);

    welcomeContainer.style.display = "none";
    //console.log("quiz started")
  });
}

function hideElements() {
  viewAnswerBtn.style.display = 'none';
  viewAnswer.style.display = 'none';
  disabledNextBtnWarning.style.display = 'none';
}

async function getQuestions(qcategory,difficulty,type) {
  try {
    //console.log("getting questions!")
    //console.log(questionCategory);
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${qcategory}&difficulty=${difficulty}&type=${type}`);
    //const response = await fetch("https://opentdb.com/api.php?amount=10");
    
    const data = await response.json();
    if (!response.ok) {
      alert("Sorry! Error occured while fetching the questions. Please refresh the page.")
      throw new Error("Could not find resource!"); 
    }
    return data.results;
  } catch (err) {
    console.error(err);
  }
}
