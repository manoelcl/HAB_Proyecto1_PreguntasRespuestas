"use strict";

const quizSection = document.querySelector(".quiz");
let counter = 0;

const addElements = (questionArray) => {
  //Borramos el posible contenido de la sección
  quizSection.innerHTML = "";

  // Volvemos a crear los elementos y les asignamos su texto

  const h2 = document.createElement("h2");
  h2.textContent = questionArray[0].question;

  const ul = document.createElement("ul");

  questionArray[0].answers.forEach((answer) => {
    const li = document.createElement("li");
    li.textContent = answer;
    li.addEventListener("click", (event) => {
      li.classList.add("check");
      [...document.querySelector(".quiz ul").children].forEach((element) => {
        element.classList.add("unclickable");
      });
      manageAnswer(event, questionArray);
    });
    ul.append(li);
  });

  quizSection.append(h2, ul);
};

const manageAnswer = async (event, questionArray) => {
  setTimeout(() => {
    if (event.target.textContent == questionArray.shift().correct) {
      counter++;
      event.target.classList.add("true");
    } else {
      event.target.classList.add("false");
    }
  }, 1000);
  setTimeout(() => {
    if (questionArray.length > 0) {
      addElements(questionArray);
    } else {
      gameOver();
    }
  }, 1500);
};

const gameOver = () => {
  createStartButton(
    `Game Over. Your score is : ${counter} out of 10`,
    "Retake quiz"
  );
};

const createStartButton = (titleString, buttonString) => {
  quizSection.innerHTML = "";
  const h2 = document.createElement("h2");
  h2.textContent = titleString;
  const p = document.createElement("p");
  p.classList.add("button");
  p.textContent = buttonString;
  p.addEventListener("click", () => {
    generateQuiz();
  });
  quizSection.append(h2, p);
};

const generateQuiz = async () => {
  counter = 0;
  try {
    //Importamos el json con método fetch
    const response = await fetch("./quz.json");

    if (response.ok) {
      const questions = await response.json();
      const randomQuestions = [];
      for (let i = 0; i < 10; i++) {
        const rnd = Math.floor(Math.random() * questions.length);
        randomQuestions.push(questions[rnd]);
        questions.splice(rnd, 1);
      }
      addElements(randomQuestions);
    } else {
      throw new Error("Failed to import");
    }
  } catch (error) {
    console.log(error);
    createStartButton(error, "Retry");
  }
};

//Añade funcionalidad al botón para iniciar el test
createStartButton("Welcome to the ultimate cinema quiz.", "Take test");
