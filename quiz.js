//https://opentdb.com/api.php?amount=1&category=9&type=multiple

const container = document.querySelector('.container');
const question = document.querySelector('.question');
const category = document.querySelector('.category');
const choiceContainer = document.querySelector('.choice-container');
const nextBtn = document.querySelector('.next-btn');
const viewAnswerBtn = document.querySelector('.view-answer-btn');
const finishQuizBtn = document.querySelector('.finish-quiz-btn');

handleQuestionData();

finishQuizBtn.addEventListener('click', () => {
  container.innerHTML = `<h1> Congrats! you finished the quiz.</h1>
  <h3 class="finish-msg">Wanna Play again? <button id="click-me-btn">Click me</botton></h3>`;
  playAgain();
});

function playAgain(){
  const clickMeBtn = document.getElementById('click-me-btn');
  clickMeBtn.addEventListener('click', () => {
    console.log("hi");
    location.reload();
  });
}

async function handleQuestionData(){
  const questionsArray = await getQuestions();
  let currentIndex = 0;
  //let wrongAnswers = 0;
  //let rightAnswers = 0;

  displayQuestion();

  function displayQuestion() {
    if (currentIndex >= questionsArray.length) {
      //alert("Quiz is over");
      nextBtn.style.display = 'none';
      finishQuizBtn.style.display = 'inline-block';

    } else {
      const questionData = questionsArray[currentIndex].question;
      const categoryData = questionsArray[currentIndex].category;
      const correctAnswer = questionsArray[currentIndex].correct_answer;
      const incorrectAnswers = questionsArray[currentIndex].incorrect_answers;//this is in nested array format
      //console.log(incorrectAnswers);
      incorrectAnswers.splice(Math.floor(Math.random() *(incorrectAnswers.length + 1)), 0, correctAnswer);
      // to place correct answer in random position of any array 
      //console.log(incorrectAnswers);

      question.innerHTML = `<p class="question">${questionData}</p>`;
      category.innerHTML = `<p class="category"><span>Category:</span> <span>${categoryData}</span></p>`
      choiceContainer.innerHTML = `${incorrectAnswers.map((item) =>`
      <li class="choice"> ${item}</li>`).join(" ")}`;
      viewAnswerBtn.innerText = "View Answer";
      nextBtn.innerText = "Next";
    
      checkCorrectAnswer(correctAnswer);
      currentIndex++;
    }
  }

  nextBtn.addEventListener('click', displayQuestion);
  nextBtn.addEventListener('click', () => {
    viewAnswerBtn.style.display = 'none';//to hide viewbtn when clicked on next.
  });
}

async function getQuestions(){
  try{
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    const data = await response.json();
    //const questionData = data.results[0];
    const questionData = data.results;
    //console.log(questionData);
    //console.log(questionData.length);
    //displayFirstQuestion(questionData);
    
    if(!response.ok){
      throw new Error("Could not find resource!");
    }
    return questionData;
  }
  catch(err){
    console.error(err);
  }
}

function checkCorrectAnswer(correctAnswer){
  const choices = document.querySelectorAll('.choice');
  //console.log(choices);
  choices.forEach((item, index) => {
    item.addEventListener('click', () => {
      //console.log(item.innerText);
      if(item.innerText == correctAnswer){
        console.log("Answer is correct")
        item.classList.add('correct');
        //rightAnswers++;
      }else{
        console.log("Wrong answer")
        item.classList.add('wrong');
        viewAnswerBtn.style.display = 'inline-block';
        //wrongAnswers++;
      }
      // Disable clicks for the rest of the <li> elements
      choices.forEach((otherchoices, otherIndex) => {
        if (index !== otherIndex) {
          otherchoices.style.pointerEvents = 'none'; // Disable click
          otherchoices.style.opacity = '0.5'; // Optionally, make them visually appear disabled
        }
      });
    });
  });
}
