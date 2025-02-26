let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = {};
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    const quizQuestions = [
      { question: "What is 2 + 2?", choices: ["3", "4", "5", "6"], correct: 1 },
      { question: "What is the capital of France?", choices: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2 }
    ];

    function adminLogin() {
      const password = prompt("Enter Admin Password:");
      if (password === "admin123") {
        showAdminPanel();
      } else {
        alert("Incorrect password!");
      }
    }

    function showAdminPanel() {
      document.getElementById("adminPanel").style.display = "block";
      let tableBody = document.getElementById("userScores");
      tableBody.innerHTML = "";
      users.sort((a, b) => b.score - a.score);
      users.forEach((user, index) => {
        let row = `<tr>
          <td>${index + 1}</td>
          <td>${user.name}</td>
          td>${user.college}</td>
          <td>${user.department}</td>
          <td>${user.year}</td>
          <td>${user.score}</td>
          <td><button onclick="deleteUser(${index})">Delete</button></td>
        </tr>`;
        tableBody.innerHTML += row;
      });
    }

    function deleteUser(index) {
      users.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      showAdminPanel();
    }

    function closeAdminPanel() {
      document.getElementById("adminPanel").style.display = "none";
    }

    document.getElementById("registrationForm").addEventListener("submit", function(event) {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const department = document.getElementById("department").value.trim();
      const year = document.getElementById("year").value;

      if (users.some(user => user.name.toLowerCase() === name.toLowerCase())) {
        alert("This user is already registered!");
        return;
      }

      currentUser = { name, department, year, score: 0 };
      document.getElementById("registrationSection").style.display = "none";
      document.getElementById("quizSection").style.display = "block";
      showQuestion();
    });

    function showQuestion() {
      clearTimeout(timer);
      if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz();
        return;
      }

      const question = quizQuestions[currentQuestionIndex];
      document.getElementById("questionText").textContent = question.question;
      document.getElementById("choicesContainer").innerHTML = "";
      
      question.choices.forEach((choice, index) => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "quiz-option";
        optionDiv.textContent = (index + 1) + ". " + choice;
        optionDiv.onclick = function() { checkAnswer(index, optionDiv); };
        document.getElementById("choicesContainer").appendChild(optionDiv);
      });

      startTimer();
    }

    function checkAnswer(index, selectedOption) {
      document.querySelectorAll(".quiz-option").forEach(option => option.onclick = null);
      if (index === quizQuestions[currentQuestionIndex].correct) score++;
      currentQuestionIndex++;
      setTimeout(showQuestion, 1000);
    }

    function startTimer() {
      let timeLeft = 10;
      document.getElementById("questionText").innerHTML += `<br><span id="timer">Time left: ${timeLeft}s</span>`;
      timer = setInterval(() => {
        document.getElementById("timer").textContent = `Time left: ${--timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          currentQuestionIndex++;
          showQuestion();
        }
      }, 1000);
    }

    function endQuiz() {
      document.getElementById("quizSection").style.display = "none";
      document.getElementById("thankYouMessage").style.display = "block";
      document.getElementById("finalScore").textContent = score;
      currentUser.score = score;
      users.push(currentUser);
      localStorage.setItem("users", JSON.stringify(users));
    }