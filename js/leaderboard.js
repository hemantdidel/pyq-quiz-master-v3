import {
db,
collection,
addDoc,
getDocs,
query,
where,
orderBy,
limit,
updateDoc,
doc,
serverTimestamp,
onSnapshot
} from "./firebase.js";

"use strict";

/* ==========================================
   DOM
========================================== */

const leaderboardList =
document.getElementById("leaderboardList");

const yourRank =
document.getElementById("yourRank");

const playerNameText =
document.getElementById("playerNameText");

/* ==========================================
   RESULT
========================================== */

const result =
JSON.parse(localStorage.getItem("quiz_result"));

if(!result){

window.location.href="index.html";

}

playerNameText.textContent =
result.playerName || "Unknown";

/* ==========================================
   SAVE SCORE
========================================== */

async function saveScore(){

const leaderboardRef =
collection(db,"leaderboard");

const q=query(

leaderboardRef,

where("playerId","==",result.playerId),

where("testId","==",result.testId)

);

const snapshot=
await getDocs(q);

const newData={

playerId:result.playerId,

name:
result.playerName ||
localStorage.getItem("player_name") ||
"Unknown",

testId:result.testId,

score:result.score,

total:result.total,

percentage:Number(

((result.score/result.total)*100)

.toFixed(1)

),

attempted:result.attempted,

timeTaken:result.timeTaken,

updatedAt:serverTimestamp()

};

if(snapshot.empty){

await addDoc(

leaderboardRef,

{

...newData,

createdAt:serverTimestamp()

}

);

return;

}

const oldDoc=
snapshot.docs[0];

const oldData=
oldDoc.data();

const betterScore=

result.score>

oldData.score;

const betterTime=

result.score===oldData.score &&

result.timeTaken<oldData.timeTaken;

if(betterScore || betterTime){

await updateDoc(

doc(

db,

"leaderboard",

oldDoc.id

),

newData

);

}

}

/* ==========================================
   LIVE LEADERBOARD
========================================== */

function loadLeaderboard(){

const leaderboardRef=
collection(db,"leaderboard");

const q=query(

leaderboardRef,

where("testId","==",result.testId),

orderBy("score","desc"),

orderBy("timeTaken","asc"),

limit(100)

);

onSnapshot(q,(snapshot)=>{

let html="";

let rank=1;

let myRank=null;

snapshot.forEach(docItem=>{

const data=docItem.data();

let medal="";

if(rank===1){

medal="🥇";

}else if(rank===2){

medal="🥈";

}else if(rank===3){

medal="🥉";

}

const isMe=

data.playerId===result.playerId;

html+=`

<div class="card"

style="margin-bottom:10px;

${isMe ? "border:2px solid #2563eb;" : ""}">

<div style="display:flex;

justify-content:space-between;

align-items:center;">

<div>

<strong>

${medal}

#${rank}

</strong>

&nbsp;

${data.name}

${isMe ? " 👤" : ""}

</div>

<div style="text-align:right;">

<b>

${data.score}/${data.total}

</b>

<br>

<small>

${data.percentage}%

</small>

<br>

<small>

⏱ ${data.timeTaken}s

</small>

</div>

</div>

</div>

`;

if(isMe){

myRank=rank;

}

rank++;

});

leaderboardList.innerHTML=

html ||

"<div class='card'>No Records Found</div>";

if(myRank){

yourRank.innerHTML=

`🏆 Your Rank : #${myRank}`;

}else{

yourRank.innerHTML=

"Not Ranked Yet";

}

});

}

/* ==========================================
   INIT
========================================== */

async function initLeaderboard(){

try{

await saveScore();

loadLeaderboard();

}

catch(error){

console.error(error);

leaderboardList.innerHTML=`

<div class="card">

<h2>

⚠ Leaderboard Error

</h2>

<p>

Unable to load leaderboard.

</p>

</div>

`;

}

}

initLeaderboard();
