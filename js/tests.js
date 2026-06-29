"use strict";

// ===========================
// URL PARAMS
// ===========================

const params = new URLSearchParams(window.location.search);

const path = params.get("path") || "";

// ===========================
// PAGE NAME
// ===========================

const pageName = path
.split("/")
.pop()
.replace(/-/g, " ")
.replace(/\b\w/g, c => c.toUpperCase());

// ===========================
// SEO
// ===========================

document.title =
pageName + " Mock Tests | PYQ Quiz Master";

document.querySelector('meta[name="description"]')
.setAttribute(
"content",
"Practice " +
pageName +
" previous year questions, online mock tests, timer, leaderboard and detailed solutions for free."
);

document.querySelector('meta[name="keywords"]')
.setAttribute(
"content",
pageName +
", PYQ, Mock Test, Previous Year Questions, MCQ"
);

const canonical =
document.querySelector('link[rel="canonical"]');

if(canonical){

canonical.href =
window.location.origin +
window.location.pathname +
"?path=" +
path;

}

// ===========================
// DOM
// ===========================

const testContainer =
document.getElementById("testContainer");

const pageTitle =
document.getElementById("pageTitle");

pageTitle.textContent =
pageName;

// ===========================
// LOAD TESTS
// ===========================

fetch(`data/${path}/tests.json`)

.then(response=>{

if(!response.ok){

throw new Error("Tests not found");

}

return response.json();

})

.then(data=>{

showTests(data);

})

.catch(()=>{

testContainer.innerHTML=`

<div class="card">

<h2>No Tests Found</h2>

<p>Please add tests.json</p>

</div>

`;

});

// ===========================
// SHOW TESTS
// ===========================

function showTests(list){

let html="";

list.forEach(item=>{

html+=`

<div class="card">

<h2>

${item.title}

</h2>

<p>

📚 ${item.questions} Questions

</p>

<p>

⏱ ${item.time} Minutes

</p>

<a
class="btn"
href="quiz.html?file=data/${path}/${item.file}">

Start Test

</a>

</div>

`;

});

testContainer.innerHTML=html;

}
