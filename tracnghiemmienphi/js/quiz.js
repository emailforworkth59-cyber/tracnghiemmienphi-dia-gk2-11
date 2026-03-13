// ===== shuffle =====

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ===== shuffle đáp án trắc nghiệm =====

function shuffleOptions(question) {
  if (question.type !== "mcq") return question;

  let arr = question.options.map((op, i) => ({
    text: op,
    correct: i === question.answer,
  }));

  shuffle(arr);

  question.options = arr.map((o) => o.text);
  question.answer = arr.findIndex((o) => o.correct);

  return question;
}

let currentQuestions = [];

// ===== render quiz =====

function renderQuiz() {
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  const mcq = shuffle(
    questions
      .filter((q) => q.type === "mcq")
      .map((q) => shuffleOptions({ ...q })),
  );

  const tf = shuffle(
    questions.filter((q) => q.type === "truefalse").map((q) => ({ ...q })),
  );

  const short = shuffle(
    questions.filter((q) => q.type === "short").map((q) => ({ ...q })),
  );

  currentQuestions = [...mcq, ...tf, ...short];

  currentQuestions.forEach((q, index) => {
    if (q.type === "mcq") renderMCQ(q, index);
    if (q.type === "truefalse") renderTrueFalse(q, index);
    if (q.type === "short") renderShort(q, index);
  });
}

// ===== render MCQ =====

function renderMCQ(q, index) {
  const quiz = document.getElementById("quiz");

  let div = document.createElement("div");
  div.className = "question";

  let html = `<h3>Câu ${index + 1}: ${q.q}</h3>`;

  const letters = ["A", "B", "C", "D"];

  q.options.forEach((op, i) => {
    const text = op.replace(/^[A-D]\.\s*/, "");

    html += `
<label class="option">
<input type="radio" name="q${index}" value="${i}" onchange="clearWrong(${index})">
<b>${letters[i]}.</b> ${text}
</label>
`;
  });

  div.innerHTML = html;
  quiz.appendChild(div);
}

// ===== render TRUE FALSE =====

function renderTrueFalse(q, index) {
  const quiz = document.getElementById("quiz");

  let div = document.createElement("div");
  div.className = "question";

  let html = `<h3>Câu ${index + 1}: ${q.q}</h3>`;

  const letters = ["A", "B", "C", "D"];

  q.options.forEach((op, i) => {
    const text = op.replace(/^[A-D]\.\s*/, "");

    html += `
<label class="option">
<input type="checkbox" name="q${index}" value="${i}" onchange="clearWrong(${index})">
<b>${letters[i]}.</b> ${text}
</label>
`;
  });

  div.innerHTML = html;
  quiz.appendChild(div);
}

// ===== render SHORT =====

function renderShort(q, index) {
  const quiz = document.getElementById("quiz");

  let div = document.createElement("div");
  div.className = "question";

  div.innerHTML = `
<h3>Câu ${index + 1}: ${q.q}</h3>
<input type="text" name="q${index}" class="short-input" oninput="clearWrong(${index})">
`;

  quiz.appendChild(div);
}

// ===== đánh dấu sai =====

function review(wrong) {
  document.querySelectorAll(".question").forEach((q) => {
    q.classList.remove("wrong");
  });

  wrong.forEach((i) => {
    let q = document.querySelectorAll(".question")[i];

    if (q) {
      q.classList.add("wrong");
    }
  });
}

// ===== xóa màu đỏ khi sửa =====

function clearWrong(index) {
  let q = document.querySelectorAll(".question")[index];

  if (q) {
    q.classList.remove("wrong");
  }
}

// ===== chuẩn hóa số =====

function parseNumber(value) {
  if (!value) return NaN;

  value = value.toString().trim();

  value = value.replace(",", ".");
  value = value.replace("%", "");

  return parseFloat(value);
}

// ===== chấm điểm =====

function gradeQuiz() {
  let score = 0;
  let wrong = [];

  currentQuestions.forEach((q, index) => {
    // ===== MCQ =====

    if (q.type === "mcq") {
      let selected = document.querySelector(`input[name="q${index}"]:checked`);

      if (!selected) {
        wrong.push(index);
      } else if (Number(selected.value) === q.answer) {
        score++;
      } else {
        wrong.push(index);
      }
    }

    // ===== TRUE FALSE =====

    if (q.type === "truefalse") {
      let boxes = document.querySelectorAll(`input[name="q${index}"]`);

      let correctCount = 0;

      boxes.forEach((box, i) => {
        let checked = box.checked;
        let should = q.answer.includes(i);

        if (checked === should) {
          correctCount++;
        }
      });

      score += correctCount * 0.25;

      if (correctCount !== 4) {
        wrong.push(index);
      }
    }

    // ===== SHORT =====

    if (q.type === "short") {
      let input = document.querySelector(`input[name="q${index}"]`);

      let user = parseNumber(input.value);
      let correct = parseNumber(q.answer);

      if (!isNaN(user) && !isNaN(correct) && Math.abs(user - correct) <= 0.5) {
        score++;
      } else {
        wrong.push(index);
      }
    }
  });

  review(wrong);

  return score;
}

// ===== thống kê điểm =====

function gradeDetail() {
  let scoreMCQ = 0;
  let scoreTF = 0;
  let scoreShort = 0;

  let totalMCQ = 0;
  let totalTF = 0;
  let totalShort = 0;

  currentQuestions.forEach((q, index) => {
    if (q.type === "mcq") {
      totalMCQ++;

      let selected = document.querySelector(`input[name="q${index}"]:checked`);

      if (selected && Number(selected.value) === q.answer) {
        scoreMCQ++;
      }
    }

    if (q.type === "truefalse") {
      totalTF++;

      let boxes = document.querySelectorAll(`input[name="q${index}"]`);

      let correctCount = 0;

      boxes.forEach((box, i) => {
        let checked = box.checked;
        let should = q.answer.includes(i);

        if (checked === should) {
          correctCount++;
        }
      });

      scoreTF += correctCount * 0.25;
    }

    if (q.type === "short") {
      totalShort++;

      let input = document.querySelector(`input[name="q${index}"]`);

      let user = parseNumber(input.value);
      let correct = parseNumber(q.answer);

      if (!isNaN(user) && !isNaN(correct) && Math.abs(user - correct) <= 0.5) {
        scoreShort++;
      }
    }
  });

  return {
    scoreMCQ,
    scoreTF,
    scoreShort,
    totalMCQ,
    totalTF,
    totalShort,
  };
}
