/* ==========================================
   PYQ Quiz Master
   Quiz Engine - Clean Fixed Version
========================================== */

"use strict";
const startBtn = document.getElementById("startQuizBtn");
const nameInput = document.getElementById("studentNameInput");

if (startBtn) {

    startBtn.addEventListener("click", () => {

        const name = nameInput.value.trim();

        if (!name) {
            alert("कृपया अपना नाम दर्ज करें");
            return;
        }

        localStorage.setItem("player_name", name);

        const card = document.querySelector(".name-card");

        if (card) {
            card.style.display = "none";
        }

    });

}
/* ==========================================
   CONFIG
========================================== */

const QuizApp = {
    data: [],
    current: 0,
    answers: [],
    totalTime: 0,
    remainingTime: 0,
    timer: null,
    dataPath: "",
    storageKey: ""
};

/* ==========================================
   DOM
========================================== */

const $ = (id) => document.getElementById(id);

const DOM = {
    title:          $("quizTitle"),
    timer:          $("timer"),
    progress:       $("progressBar"),
    questionNumber: $("questionNumber"),
    questionBox:    $("questionBox"),
    optionsBox:     $("optionsBox"),
    palette:        $("palette"),
    prevBtn:        $("prevBtn"),
    nextBtn:        $("nextBtn"),
    submitBtn:      $("submitBtn"),
    paletteToggle:  $("paletteToggle")
};

/* ==========================================
   URL PARAMS
========================================== */

function loadURL() {
    const params = new URLSearchParams(window.location.search);
    const file = params.get("file");

    if (!file) {
        alert("Quiz file missing.");
        window.location.href = "index.html";
        return false;
    }

    QuizApp.dataPath  = file;
    QuizApp.storageKey = "quiz_" + encodeURIComponent(file);
    return true;
}

/* ==========================================
   LOCAL STORAGE
========================================== */

function saveState() {
    const state = {
        current:       QuizApp.current,
        answers:       QuizApp.answers,
        remainingTime: QuizApp.remainingTime
    };
    localStorage.setItem(QuizApp.storageKey, JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem(QuizApp.storageKey);
    if (!saved) return;
    try {
        const state = JSON.parse(saved);
        QuizApp.current       = state.current       ?? 0;
        QuizApp.answers       = state.answers       ?? [];
        QuizApp.remainingTime = state.remainingTime ?? 0;
    } catch (e) {
        console.log(e);
    }
}

/* ==========================================
   LOAD QUIZ DATA
========================================== */

async function loadQuiz() {
    try {
        const response = await fetch(QuizApp.dataPath);

        if (!response.ok) throw new Error("Unable to load quiz data");

        QuizApp.data = await response.json();

        if (!Array.isArray(QuizApp.data)) throw new Error("Invalid quiz data format");

        // Init answers array if fresh start
        if (QuizApp.answers.length === 0) {
            QuizApp.answers = new Array(QuizApp.data.length).fill(null);
        }

        // Set time if fresh start
        QuizApp.totalTime = QuizApp.data.length * 60;
        if (QuizApp.remainingTime <= 0) {
            QuizApp.remainingTime = QuizApp.totalTime;
        }

        // Set title
        DOM.title.textContent = QuizApp.dataPath
            .split("/").pop()
            .replace(".json", "")
            .replaceAll("-", " ")
            .toUpperCase();

        initQuiz();

    } catch (error) {
        console.error(error);
        DOM.questionBox.innerHTML = `
            <h2>⚠ Quiz load failed</h2>
            <p>${error.message}</p>
        `;
    }
}

/* ==========================================
   INIT
========================================== */

function initQuiz() {
    console.log("Questions loaded:", QuizApp.data.length);

    showResumeDialog();
    createPalette();
    bindEvents();
    renderQuestion();
    updateProgress();
    updateTimer();
    startTimer();
}

/* ==========================================
   RESUME DIALOG
========================================== */

function showResumeDialog() {
    const saved = localStorage.getItem(QuizApp.storageKey);
    if (!saved) return;

    try {
        const state = JSON.parse(saved);

        if (Array.isArray(state.answers) && state.answers.some(a => a !== null)) {
            const resume = confirm("पिछला Quiz मिला।\nवहाँ से जारी रखें?");

            if (!resume) {
                localStorage.removeItem(QuizApp.storageKey);
                QuizApp.current       = 0;
                QuizApp.answers       = new Array(QuizApp.data.length).fill(null);
                QuizApp.remainingTime = QuizApp.totalTime;
            }
        }
    } catch (e) {
        console.log(e);
    }
}

/* ==========================================
   RENDER QUESTION
========================================== */

function renderQuestion() {
    const q = QuizApp.data[QuizApp.current];
    if (!q) return;

    DOM.questionNumber.textContent =
        `Question ${QuizApp.current + 1} / ${QuizApp.data.length}`;

    DOM.questionBox.innerHTML =
        `<h2>Q${QuizApp.current + 1}. ${q.question}</h2>`;

    DOM.optionsBox.innerHTML = "";

    q.options.forEach((option, index) => {
        const item = document.createElement("div");
        item.className = "option";

        if (QuizApp.answers[QuizApp.current] === index) {
            item.classList.add("selected");
        }

        item.innerHTML = `
            <label>
                <input
                    type="radio"
                    name="quizOption"
                    value="${index}"
                    ${QuizApp.answers[QuizApp.current] === index ? "checked" : ""}
                >
                ${option}
            </label>
        `;

        item.addEventListener("click", () => {
            QuizApp.answers[QuizApp.current] = index;
            saveState();
            updatePalette();
            updateProgress();
            renderQuestion();
        });

        DOM.optionsBox.appendChild(item);
    });

    updatePalette();
    updateProgress();

    DOM.prevBtn.disabled = (QuizApp.current === 0);
    DOM.nextBtn.disabled = (QuizApp.current === QuizApp.data.length - 1);
}

/* ==========================================
   PALETTE
========================================== */

function createPalette() {
    DOM.palette.innerHTML = "";

    QuizApp.data.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.className = "palette-btn";
        btn.textContent = index + 1;

        btn.addEventListener("click", () => {
            QuizApp.current = index;
            renderQuestion();
        });

        DOM.palette.appendChild(btn);
    });

    updatePalette();
}

function updatePalette() {
    const buttons = DOM.palette.querySelectorAll(".palette-btn");

    buttons.forEach((btn, index) => {
        btn.classList.remove("current", "answered");

        if (index === QuizApp.current) {
            btn.classList.add("current");
        }
        if (QuizApp.answers[index] !== null) {
            btn.classList.add("answered");
        }
    });
}

/* ==========================================
   PROGRESS BAR
========================================== */

function updateProgress() {
    const answered = QuizApp.answers.filter(x => x !== null).length;
    const percent =
    QuizApp.data.length
        ? (answered / QuizApp.data.length) * 100
        : 0;
    DOM.progress.style.width = percent + "%";
}

/* ==========================================
   NAVIGATION
========================================== */

function bindEvents() {

    DOM.prevBtn.addEventListener("click", () => {
        if (QuizApp.current > 0) {
            QuizApp.current--;
            renderQuestion();
        }
    });

    DOM.nextBtn.addEventListener("click", () => {
        if (QuizApp.current < QuizApp.data.length - 1) {
            QuizApp.current++;
            renderQuestion();
        }
    });

    if (DOM.paletteToggle) {

        DOM.paletteToggle.addEventListener("click", () => {

            DOM.palette.classList.toggle("show");

        });

    }

}
/* ==========================================
   KEYBOARD NAVIGATION
========================================== */

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && QuizApp.current > 0) {
        QuizApp.current--;
        renderQuestion();
    }

    if (e.key === "ArrowRight" && QuizApp.current < QuizApp.data.length - 1) {
        QuizApp.current++;
        renderQuestion();
    }

    if (["1","2","3","4"].includes(e.key)) {
        const optionIndex = Number(e.key) - 1;
        const q = QuizApp.data[QuizApp.current];

        if (q && q.options[optionIndex] !== undefined) {
            QuizApp.answers[QuizApp.current] = optionIndex;
            saveState();
            updatePalette();
            updateProgress();
            renderQuestion();
        }
    }
});

/* ==========================================
   TIMER
========================================== */

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}

function updateTimer() {
    DOM.timer.textContent = "⏱ " + formatTime(QuizApp.remainingTime);
}

function startTimer() {
    if (QuizApp.timer) clearInterval(QuizApp.timer);

    QuizApp.timer = setInterval(() => {
        QuizApp.remainingTime--;
        saveState();
        updateTimer();

        if (QuizApp.remainingTime <= 0) {
            clearInterval(QuizApp.timer);
            submitQuiz();
        }
    }, 1000);
}

/* ==========================================
   AUTOSAVE (every 5 seconds)
========================================== */

setInterval(() => saveState(), 5000);

document.addEventListener("visibilitychange", () => {
    if (document.hidden) saveState();
});

/* ==========================================
   SUBMIT
========================================== */

function submitQuiz() {
    clearInterval(QuizApp.timer);

    let score = 0;

    QuizApp.data.forEach((q, index) => {
        if (Number(QuizApp.answers[index]) === Number(q.answer)) {
            score++;
        }
    });

    const attempted = QuizApp.answers.filter(x => x !== null).length;

    const result = {
        total:       QuizApp.data.length,
        score:       score,
        attempted:   attempted,
        answers:     QuizApp.answers,
        questions:   QuizApp.data,
        timeLeft:    QuizApp.remainingTime,
        submittedAt: Date.now()
    };

    localStorage.setItem("quiz_result", JSON.stringify(result));
    localStorage.removeItem(QuizApp.storageKey);

    window.location.href = "result.html";
}

DOM.submitBtn.addEventListener("click", () => {
    const ok = confirm("क्या आप टेस्ट सबमिट करना चाहते हैं?");
    if (ok) submitQuiz();
});

/* ==========================================
   AUTO SAVE ON EXIT
========================================== */

window.addEventListener("beforeunload", () => saveState());

/* ==========================================
   START
========================================== */

window.addEventListener("load", () => {
    if (!loadURL()) return;
    loadState();
    loadQuiz();
});

/* ==========================================
   ERROR HANDLER
========================================== */

window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
});
