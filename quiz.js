//https://opentdb.com/api.php?amount=1&category=9&type=multiple

const container = document.querySelector('.container');

getQuestions();

async function getQuestions(){
  try{
    const response = await fetch("https://opentdb.com/api.php?amount=1");
    const data = await response.json();
    const questionData = data.results[0];
    displayQuestions(questionData);

    if(!response.ok){
      throw new Error("Could not find resource!");
    }
  }
  catch(err){
    console.error(err);
  }
}

async function displayQuestions(data) {
  console.log(data);
  const questionData = data.question;
  const categoryData = data.category;
  const correctAnswer = data.correct_answer;
  //const {questionData, categoryData, correctAnswer} = data[question,category,correct_answer];
  const incorrectAnswers = data.incorrect_answers; 
  //this will be in array format
  incorrectAnswers.splice(Math.floor(Math.random() *(incorrectAnswers.length + 1)), 0, correctAnswer);
  // to place correct answer in random position of any array 
  //console.log(incorrectAnswers);
  console.log(correctAnswer);

  createDomItems();

  const question = document.querySelector('.question');
  const category = document.querySelector('.category');
  const choiceContainer = document.querySelector('.choice-container');
  const nextBtn = document.querySelector('.next-btn');
  const viewAnswerBtn = document.querySelector('.view-answer-btn');

  question.innerHTML = `<p class="question">${questionData}</p>`;
  category.innerHTML = `<p class="category"><span>Category:</span> <span>${categoryData}</span></p>`
  choiceContainer.innerHTML = `${incorrectAnswers.map((item) =>`
  <li class="choice"> ${item}</li>`).join(" ")}`;
  
  viewAnswerBtn.innerText = "View Answer";
  nextBtn.innerText = "Next";

  checkCorrectAnswer(correctAnswer);
  activeNextBtnListener();

}

function createDomItems(){
  const question = document.createElement('h2');
  question.classList.add('question');
  container.appendChild(question);

  const category = document.createElement('p');
  category.classList.add('category');
  container.appendChild(category);

  const choiceContainer = document.createElement('ul');
  choiceContainer.classList.add('choice-container');
  container.appendChild(choiceContainer);

  const bottomDiv = document.createElement('div');
  bottomDiv.classList.add('bottom-div');
  container.appendChild(bottomDiv);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('next-btn');
  bottomDiv.appendChild(nextBtn);

  const viewAnswerBtn = document.createElement('button');
  viewAnswerBtn.classList.add('view-answer-btn');
  bottomDiv.appendChild(viewAnswerBtn);

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
      }else{
        console.log("Wrong answer")
        item.classList.add('wrong');
        const viewAnswerBtn = document.querySelector('.view-answer-btn');
        viewAnswerBtn.style.display = 'inline-block';
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

function activeNextBtnListener(){
  const nextBtn = document.querySelector('.next-btn');

  nextBtn.addEventListener('click', () => {
      location.reload(); // Reloads the page
  });
}