"use strict";

const result = JSON.parse(localStorage.getItem("quiz_result"));

if (!result) {
    window.location.href = "index.html";
}

const container = document.getElementById("reviewContainer");

result.questions.forEach((question, index) => {

    const card = document.createElement("div");
    card.className = "reviewCard";

    const userAnswer    = result.answers[index];
    const correctAnswer = question.answer;

    let status      = "Skipped";
    let statusClass = "skipStatus";
    let cardClass   = "skip-card";

    if (userAnswer !== null) {
        if (Number(userAnswer) === Number(correctAnswer)) {
            status      = "✅ Correct";
            statusClass = "correctStatus";
            cardClass   = "correct-card";
        } else {
            status      = "❌ Wrong";
            statusClass = "wrongStatus";
            cardClass   = "wrong-card";
        }
    }

    card.classList.add(cardClass);

    let html = `
        <span class="status ${statusClass}">${status}</span>
        <h3>Q${index + 1}. ${question.question}</h3>
    `;

    question.options.forEach((option, i) => {
        let cls = "option";

        if (Number(i) === Number(correctAnswer)) {
            cls += " correct";
        }
        if (userAnswer !== null && Number(userAnswer) === i && Number(userAnswer) !== Number(correctAnswer)) {
            cls += " wrong";
        }

        html += `<div class="${cls}">${option}</div>`;
    });

    if (question.explanation) {
        html += `<div class="explanation"><b>💡 Explanation:</b> ${question.explanation}</div>`;
    }

    card.innerHTML = html;
    container.appendChild(card);
});
