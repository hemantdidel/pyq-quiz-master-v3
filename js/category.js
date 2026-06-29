"use strict";

// ==========================
// URL PARAMS
// ==========================

const params = new URLSearchParams(window.location.search);

const path = params.get("path");

// ==========================
// PAGE NAME
// ==========================

const pageName = path
.replace(/-/g, " ")
.replace(/\b\w/g, c => c.toUpperCase());

// ==========================
// SEO
// ==========================

document.title =
pageName + " | PYQ Quiz Master";

document.querySelector('meta[name="description"]')
.setAttribute(
"content",
"Practice " +
pageName +
" previous year questions, mock tests and online quizzes for free."
);

document.querySelector('meta[name="keywords"]')
.setAttribute(
"content",
pageName +
", PYQ, Mock Test, Previous Year Questions"
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

// ==========================
// DOM
// ==========================

const pageTitle =
document.getElementById("pageTitle");

const examContainer =
document.getElementById("examContainer");

const searchInput =
document.getElementById("searchInput");

// ==========================
// TITLE
// ==========================

pageTitle.textContent = pageName;

// ==========================
// DATA
// ==========================

let examList = [];

// ==========================
// LOAD DATA
// ==========================

fetch(`data/${path}/exams.json`)

.then(response=>{

    if(!response.ok){

        throw new Error("Unable to load");

    }

    return response.json();

})

.then(data=>{

    examList=data;

    showCards(examList);

})

.catch(()=>{

    examContainer.innerHTML=`

    <div class="card">

        <h2>No Data Found</h2>

        <p>Please add exams.json</p>

    </div>

    `;

});

// ==========================
// SHOW CARDS
// ==========================

function showCards(list){

let html="";

list.forEach(item=>{

html+=`

<div class="card">

<h2>

${item.icon || "📚"} ${item.name}

</h2>

<p>

${item.description}

</p>

<a
class="btn"
href="exam.html?path=${path}/${item.folder}">

Open

</a>

</div>

`;

});

examContainer.innerHTML=html;

}

// ==========================
// SEARCH
// ==========================

if(searchInput){

searchInput.addEventListener("input",()=>{

const keyword=
searchInput.value
.trim()
.toLowerCase();

const filtered=
examList.filter(item=>

item.name
.toLowerCase()
.includes(keyword)

);

showCards(filtered);

});

}
