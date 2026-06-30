"use strict";

import {
db,
collection,
query,
orderBy,
limit,
onSnapshot
} from "./firebase.js";

// ===========================
// DOM
// ===========================

const attemptList =
document.getElementById("attemptList");

const todayUsers =
document.getElementById("todayUsers");

const todayAttempts =
document.getElementById("todayAttempts");

const avgScore =
document.getElementById("avgScore");

const highestScore =
document.getElementById("highestScore");

const searchInput =
document.getElementById("searchInput");

// ===========================

let allAttempts=[];

// ===========================

function loadDashboard(){

const q=query(
collection(db,"attempts"),
orderBy("submittedAt","desc"),
limit(500)
);

onSnapshot(q,(snapshot)=>{

allAttempts=[];

snapshot.forEach(doc=>{

allAttempts.push(doc.data());

});

render(allAttempts);

});

}

// ===========================

function render(data){

let html="";

let highest=0;

let totalScore=0;

const today=new Date().toDateString();

const users=new Set();

let attemptsToday=0;

data.forEach(item=>{

if(item.score>highest){

highest=item.score;

}

totalScore+=item.percentage;

const date=item.submittedAt?.toDate();

if(date){

if(date.toDateString()===today){

attemptsToday++;

users.add(item.playerId);

}

}

html+=`

<div class="card">

<h3>${item.playerName}</h3>

<p>
📚 ${item.testTitle || item.testId}
</p>

<p>
🏆 ${item.score}/${item.total}
</p>

<p>
📈 ${item.percentage}%
</p>

<p>
⏱ ${item.timeTaken}s
</p>

</div>

`;

});

attemptList.innerHTML=

html ||

"<div class='card'>No Attempts Found</div>";

todayUsers.textContent=
users.size;

todayAttempts.textContent=
attemptsToday;

highestScore.textContent=
highest;

avgScore.textContent=

data.length

?

(totalScore/data.length).toFixed(1)+"%"

:

"0%";

}

// ===========================

searchInput.addEventListener("input",()=>{

const key=

searchInput.value

.trim()

.toLowerCase();

const filtered=

allAttempts.filter(item=>

(item.playerName||"")

.toLowerCase()

.includes(key)

||

(item.testTitle||"")

.toLowerCase()

.includes(key)

);

render(filtered);

});

// ===========================

loadDashboard();
