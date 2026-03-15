document.getElementById("submit").onclick = function () {
  let score = gradeQuiz();

  let result = document.getElementById("result");

  result.innerHTML = `
Điểm: ${score}
`;
};

const retryBtn = document.getElementById("retry");
const modal = document.getElementById("retryModal");

retryBtn.onclick = function () {
  modal.style.display = "flex";
};

document.getElementById("cancelRetry").onclick = function () {
  modal.style.display = "none";
};

document.getElementById("confirmRetry").onclick = function () {
  modal.style.display = "none";

  renderQuiz();
  document.getElementById("result").innerHTML = "";
};
renderQuiz();

const themeToggle = document.getElementById("themeToggle");

themeToggle.onclick = function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.innerText = "SÁNG";
  } else {
    themeToggle.innerText = "TỐI";
  }
};
function openImage(img) {
  const modal = document.getElementById("imgModal");
  const preview = document.getElementById("imgPreview");

  preview.src = img.src;
  modal.style.display = "flex";
}

function closeImage() {
  document.getElementById("imgModal").style.display = "none";
}
document.getElementById("submit").onclick = function () {
  gradeQuiz();
  let result = gradeDetail();

  document.getElementById("result").innerHTML = `
Trắc nghiệm: ${result.scoreMCQ}/${result.totalMCQ} <br>
Đúng sai: ${result.scoreTF}/${result.totalTF} <br>
Trả lời ngắn: ${result.scoreShort}/${result.totalShort}
`;
};
