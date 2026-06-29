"use strict";

const result =
JSON.parse(localStorage.getItem("quiz_result"));

if(!result){

window.location.href="index.html";

}

// ===========================
// RESULT
// ===========================

const total=result.total;

const score=result.score;

const attempted=result.attempted;

const correct=score;

const wrong=attempted-correct;

const unattempted=total-attempted;

const percentage=
((score/total)*100).toFixed(1);

// ===========================
// PAGE TITLE
// ===========================

document.title=
"Result | PYQ Quiz Master";

// ===========================
// SHOW RESULT
// ===========================

document.getElementById("score").textContent=
`${score}/${total}`;

document.getElementById("correct").textContent=
correct;

document.getElementById("wrong").textContent=
wrong;

document.getElementById("unattempted").textContent=
unattempted;

document.getElementById("percentage").textContent=
percentage+"%";

// ===========================
// PROGRESS
// ===========================

setTimeout(()=>{

document.getElementById("progressFill")
.style.width=
percentage+"%";

},150);

// ===========================
// BUTTONS
// ===========================

document.getElementById("reviewBtn")
.addEventListener("click",()=>{

window.location.href="review.html";

});

document.getElementById("retryBtn")
.addEventListener("click",()=>{

history.back();

});

document.getElementById("homeBtn")
.addEventListener("click",()=>{

window.location.href="index.html";

});
