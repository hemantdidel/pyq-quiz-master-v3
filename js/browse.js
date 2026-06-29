"use strict";

/* ==========================
   URL PARAMS
========================== */

const params = new URLSearchParams(window.location.search);

const path = params.get("path") || "";

/* ==========================
   DOM
========================== */

const pageTitle =
document.getElementById("pageTitle");

const cardContainer =
document.getElementById("cardContainer");

const searchInput =
document.getElementById("searchInput");

/* ==========================
   PAGE NAME
========================== */

const pageName = path
.split("/")
.pop()
.replace(/-/g," ")
.replace(/\b\w/g,c=>c.toUpperCase());

pageTitle.textContent = pageName;

/* ==========================
   SEO
========================== */

document.title =
pageName + " | PYQ Quiz Master";

document.querySelector('meta[name="description"]')
.setAttribute(
"content",
"Practice " +
pageName +
" previous year questions, mock tests and quizzes."
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

/* ==========================
   DATA
========================== */

let items = [];

/* ==========================
   LOAD
========================== */

load();

async function load(){

try{

const response =
await fetch(`data/${path}/exams.json`);

if(response.ok){

items =
await response.json();

showCards(items);

return;

}

}catch(error){

console.log(error);

}

/* No exams.json → Open Tests */

window.location.href =
`tests.html?path=${path}`;

}

/* ==========================
   SHOW CARDS
========================== */

function showCards(list){

let html = "";

list.forEach(item=>{

const title =
item.name ||
item.title ||
"Untitled";

const description =
item.description ||
"";

const icon =
item.icon ||
"📚";

html += `

<div class="card">

<h2>

${icon} ${title}

</h2>

<p>

${description}

</p>

<a
class="btn"
href="browse.html?path=${path}/${item.folder}">

Open

</a>

</div>

`;

});

cardContainer.innerHTML = html;

}

/* ==========================
   SEARCH
========================== */

if(searchInput){

searchInput.addEventListener("input",()=>{

const keyword =
searchInput.value
.trim()
.toLowerCase();

const filtered =
items.filter(item=>{

const text =
(item.name ||
item.title ||
"")
.toLowerCase();

return text.includes(keyword);

});

showCards(filtered);

});

}
