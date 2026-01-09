// =========================
// VARIABEL GLOBAL
// =========================
let semuaSoal = [];
let soalUjian = [];
let indexSoal = 0;
let benar = 0;

let waktuTotal = 60 * 60; // 60 menit
let timerInterval;

// =========================
// MULAI UJIAN
// =========================
function mulaiUjian() {
  fetch("soal.txt")
    .then(res => res.text())
    .then(parseSoal)
    .catch(err => {
      alert("Gagal memuat file soal.txt");
      console.error(err);
    });

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("quiz-area").style.display = "block";

  mulaiTimer();
}

// =========================
// PARSE FILE TXT
// =========================
function parseSoal(text) {
  semuaSoal = [];

  // Pisahkan soal dan kunci jawaban
  const bagian = text.split(/KUNCI JAWABAN/i);
  if (bagian.length < 2) {
    alert("Format file salah: KUNCI JAWABAN tidak ditemukan");
    return;
  }

  let soalText = bagian[0];
  let kunciText = bagian[1];

  // Hapus judul "SOAL"
  soalText = soalText.replace(/SOAL/i, "").trim();

  // Ambil kunci jawaban
  const kunci = {};
  kunciText
    .trim()
    .split("\n")
    .forEach(baris => {
      const cocok = baris.match(/(\d+)\.\s*([ABCD])/i);
      if (cocok) {
        kunci[cocok[1]] = cocok[2].toUpperCase();
      }
    });

  // Pecah soal per blok
  const soalBlok = soalText.split(/\n\s*\n/);

  let nomorSoal = 1;

  for (let blok of soalBlok) {
    const baris = blok
      .split("\n")
      .map(b => b.trim())
      .filter(b => b !== "");

    if (baris.length >= 5) {
      const soal = baris[0].replace(/^\d+\.\s*/, "");
      const A = baris[1].replace(/^A\.\s*/, "");
      const B = baris[2].replace(/^B\.\s*/, "");
      const C = baris[3].replace(/^C\.\s*/, "");
      const D = baris[4].replace(/^D\.\s*/, "");

      semuaSoal.push({
        soal,
        A,
        B,
        C,
        D,
        kunci: kunci[nomorSoal]
      });
      nomorSoal++;
    }

  }

  if (semuaSoal.length === 0) {
    alert("Soal tidak berhasil dibaca. Cek format file.");
    return;
  }

  // Acak dan ambil 25 soal
  soalUjian = acakArray(semuaSoal).slice(0, 25);

  tampilkanSoal();
}

// =========================
// TAMPILKAN SOAL
// =========================
function tampilkanSoal() {
  //Tampilkan progress bar
  const progress = ((indexSoal + 1) / soalUjian.length) * 100;
  document.getElementById("progress-bar").style.width = progress + "%";

  // Jika soal habis
  if (indexSoal >= soalUjian.length) {
    selesai();
    return;
  }

  // Reset pesan & tombol
  document.getElementById("message").textContent = "";
  document.getElementById("nextBtn").style.display = "none";

  const soal = soalUjian[indexSoal];

  // Teks soal
  document.getElementById("question").innerHTML = `
  <div class="question-meta">
    soal ${indexSoal + 1} dari ${soalUjian.length}
  </div>
  <div class="question-text">
    ${soal.soal}
  </div>
`;

  // Tombol jawaban
  const pilihanDiv = document.getElementById("choices");
  pilihanDiv.innerHTML = "";

  ["A", "B", "C", "D"].forEach(huruf => {
    const btn = document.createElement("button");
    btn.className = "choice-btn answer-btn";
    btn.textContent = `${huruf}. ${soal[huruf]}`;
    btn.onclick = () => cekJawaban(huruf);
    pilihanDiv.appendChild(btn);
  });
}

// =========================
// CEK JAWABAN
// =========================
function cekJawaban(pilihan) {
  const soal = soalUjian[indexSoal];

  if (pilihan === soal.kunci) {
    benar++;
    indexSoal++;
    tampilkanSoal();
  } else {
    document.getElementById("message").textContent =
      `❌ Salah. Jawaban yang benar: ${soal.kunci}. ${soal[soal.kunci]}`;

    disableChoices(); // ⛔ disable A B C
    document.getElementById("nextBtn").style.display = "inline-block";
  }
}

// =========================
// NEXT (JIKA SALAH)
// =========================
function soalBerikutnya() {
  indexSoal++;
  tampilkanSoal();
}

// =========================
// DISABLE JAWABAN JIKA SALAH
// =========================
function disableChoices() {
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach(btn => {
    btn.disabled = true;
  });
}


// =========================
// TIMER GLOBAL (60 MENIT)
// =========================
function mulaiTimer() {
  timerInterval = setInterval(() => {
    waktuTotal--;

    const menit = Math.floor(waktuTotal / 60);
    const detik = waktuTotal % 60;

    document.getElementById("timer").textContent =
      `${menit}:${detik.toString().padStart(2, "0")}`;

    if (waktuTotal <= 0) {
      clearInterval(timerInterval);
      selesai();
    }
  }, 1000);
}

// =========================
// SELESAI UJIAN
// =========================
function selesai() {
  clearInterval(timerInterval);

  const nilai = Math.round((benar / soalUjian.length) * 100);

  document.getElementById("quiz-area").innerHTML = `
    <h2>🎉 Ujian Selesai</h2>
    <p>Benar: ${benar} dari ${soalUjian.length}</p>
    <p><strong>Nilai: ${nilai}%</strong></p>
    <button onclick="location.reload()">Ulangi</button>
  `;
}

// =========================
// UTIL: ACAK ARRAY
// =========================
function acakArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
