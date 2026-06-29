"use strict";

// ===========================
// LOAD RESULT
// ===========================

const result =
JSON.parse(localStorage.getItem("quiz_result"));

if (!result) {

    window.location.href = "index.html";

}

// ===========================
// PAGE TITLE
// ===========================

document.title =
"Review Answers | PYQ Quiz Master";

// ===========================
// DOM
// ===========================

const container =
document.getElementById("reviewContainer");

// ===========================
// RENDER QUESTIONS
// ===========================

result.questions.forEach((question, index) => {

    const card =
    document.createElement("div");

    card.className = "reviewCard";

    const userAnswer =
    result.answers[index];

    const correctAnswer =
    Number(question.answer);

    let status = "Skipped";
    let statusClass = "skipStatus";
    let cardClass = "skip-card";

    if (userAnswer !== null) {

        if (Number(userAnswer) === correctAnswer) {

            status = "✅ Correct";
            statusClass = "correctStatus";
            cardClass = "correct-card";

        } else {

            status = "❌ Wrong";
            statusClass = "wrongStatus";
            cardClass = "wrong-card";

        }

    }

    card.classList.add(cardClass);

    let html = `

    <span class="status ${statusClass}">

        ${status}

    </span>

    <h3>

        Q${index + 1}. ${question.question}

    </h3>

    `;

    question.options.forEach((option, i) => {

        let cls = "option";

        if (i === correctAnswer) {

            cls += " correct";

        }

        if (
            userAnswer !== null &&
            Number(userAnswer) === i &&
            i !== correctAnswer
        ) {

            cls += " wrong";

        }

        html += `

        <div class="${cls}">

            ${option}

        </div>

        `;

    });

    // ===========================
    // Explanation
    // ===========================

    if (
        question.explanation &&
        question.explanation.trim() !== ""
    ) {

        html += `

        <div class="explanation">

            <b>💡 Explanation:</b><br>

            ${question.explanation}

        </div>

        `;

    }

    card.innerHTML = html;

    container.appendChild(card);

});
