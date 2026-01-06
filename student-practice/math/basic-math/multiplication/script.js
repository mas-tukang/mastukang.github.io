// =======================
// STATUS GLOBAL
// =======================
let questions = [];
let currentIndex = 0;
let correctAnswers = 0;
let timer;
let timeLeft;
let timePerQuestion;

// =======================
// PENGATURAN LEVEL (UBAH DI SINI)
// =======================
const LEVELS = {
  easy: {
    min: 2,
    max: 5,
    time: 60
  },
  medium: {
    min: 4,
    max: 7,
    time: 60
  },
  hard: {
    min: 6,
    max: 9,
    time: 60
  }
};

// =======================
// ELEMEN
// =======================
const startBtn = document.getElementById("startBtn");
const checkBtn = document.getElementById("checkBtn");
const answerInput = document.getElementById("answer");

// =======================
// EVENT
// =======================
startBtn.addEventListener("click", mulaiGame);
checkBtn.addEventListener("click", cekJawaban);

answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") cekJawaban();
});

// =======================
// MULAI GAME
// =======================
function mulaiGame() {
  const difficulty = document.getElementById("difficulty").value;
  const totalQuestions = Number(
    document.getElementById("totalQuestionsInput").value
  );

  const level = LEVELS[difficulty];
  timePerQuestion = level.time;

  // BUAT SOAL UNIK (TANPA 0 DAN 1)
  questions = [];
  for (let i = level.min; i <= level.max; i++) {
    for (let j = level.min; j <= level.max; j++) {
      questions.push({ a: i, b: j });
    }
  }

  acakArray(questions);
  questions = questions.slice(0, totalQuestions);

  currentIndex = 0;
  correctAnswers = 0;

  document.querySelector(".settings").classList.add("hidden");
  document.getElementById("gameArea").classList.remove("hidden");

  soalBerikutnya();
}

// =======================
// SOAL BERIKUTNYA
// =======================
function soalBerikutnya() {
  clearInterval(timer);

  if (currentIndex >= questions.length) {
    selesaiGame();
    return;
  }

  const q = questions[currentIndex];

  document.getElementById("question").textContent =
    `❓ ${q.a} × ${q.b} = ?`;

  document.getElementById("message").textContent = "";
  answerInput.value = "";
  answerInput.focus();

  timeLeft = timePerQuestion;
  document.getElementById("time").textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("message").textContent =
        `⏰ Waktu habis! Jawaban yang benar: ${q.a * q.b}`;
      currentIndex++;
      setTimeout(soalBerikutnya, 2000);
    }
  }, 1000);
}

// =======================
// CEK JAWABAN
// =======================
function cekJawaban() {
  if (answerInput.value === "") return;

  clearInterval(timer);

  const q = questions[currentIndex];
  const userAnswer = Number(answerInput.value);

  if (userAnswer === q.a * q.b) {
    correctAnswers++;
    document.getElementById("message").textContent = "✅ Tepat Sekali!";
  } else {
    document.getElementById("message").textContent =
      `❌ Ups... Jawaban yang benar: ${q.a * q.b}`;
  }

  currentIndex++;
  setTimeout(soalBerikutnya, 2000);
}

// =======================
// SELESAI GAME
// =======================
function selesaiGame() {
  const score = Math.round(
    (correctAnswers / questions.length) * 100
  );

  document.getElementById("gameArea").innerHTML = `
    <h2>🏁 Selesai!</h2>
    <p>✅ Jawaban benar: ${correctAnswers}</p>
    <p>📊 Nilai: ${score}%</p>
    <button onclick="location.reload()">🔁 Main Lagi</button>
  `;
}

// =======================
// ACAK ARRAY
// =======================
function acakArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
