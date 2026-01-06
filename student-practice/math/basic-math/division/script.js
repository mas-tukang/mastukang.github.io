let questions = [];
let currentIndex = 0;
let correctAnswers = 0;
let timer;
let timeLeft;
let timePerQuestion;

const LEVELS = {
  easy:   { min: 2, max: 5, time: 60 },
  medium: { min: 2, max: 9, time: 40 },
  hard:   { min: 2, max: 12, time: 25 }
};

const startBtn = document.getElementById("startBtn");
const checkBtn = document.getElementById("checkBtn");
const answerInput = document.getElementById("answer");

startBtn.addEventListener("click", mulaiGame);
checkBtn.addEventListener("click", cekJawaban);
answerInput.addEventListener("keydown", e => {
  if (e.key === "Enter") cekJawaban();
});

function mulaiGame() {
  const levelKey = document.getElementById("levelSelect").value;
  const totalQuestions = Number(document.getElementById("totalQuestionsInput").value);
  const level = LEVELS[levelKey];

  timePerQuestion = level.time;
  questions = [];
  currentIndex = 0;
  correctAnswers = 0;

  for (let a = level.min; a <= level.max; a++) {
    for (let b = level.min; b <= level.max; b++) {
      questions.push({
        dividend: a * b,
        divisor: b,
        answer: a
      });
    }
  }

  shuffleArray(questions);
  questions = questions.slice(0, totalQuestions);

  document.querySelector(".settings").style.display = "none";
  document.getElementById("gameArea").classList.remove("hidden");

  soalBerikutnya();
}

function soalBerikutnya() {
  clearInterval(timer);
  if (currentIndex >= questions.length) return selesaiGame();

  const q = questions[currentIndex];
  timeLeft = timePerQuestion;

  document.getElementById("question").textContent =
    `❓ ${q.dividend} ÷ ${q.divisor} = ?`;
  document.getElementById("time").textContent = timeLeft;
  document.getElementById("message").textContent = "";
  answerInput.value = "";
  answerInput.focus();

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("message").textContent =
        `⏰ Jawaban: ${q.answer}`;
      currentIndex++;
      setTimeout(soalBerikutnya, 2000);
    }
  }, 1000);
}

function cekJawaban() {
  if (answerInput.value === "") return;
  clearInterval(timer);

  const q = questions[currentIndex];
  const userAnswer = Number(answerInput.value);

  if (userAnswer === q.answer) {
    correctAnswers++;
    document.getElementById("message").textContent = "✅ Tepat Sekali!";
  } else {
    document.getElementById("message").textContent =
      `❌ Ups... Jawaban yang benar: ${q.answer}`;
  }

  currentIndex++;
  setTimeout(soalBerikutnya, 2000);
}

function selesaiGame() {
  const score = Math.round((correctAnswers / questions.length) * 100);
  document.getElementById("gameArea").innerHTML = `
    <h2>🎉 Selesai!</h2>
    <p>Benar: ${correctAnswers} dari ${questions.length}</p>
    <p><strong>Nilai: ${score}%</strong></p>
    <button onclick="location.reload()">Main Lagi</button>
  `;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
