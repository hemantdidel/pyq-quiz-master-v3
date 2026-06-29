"use strict";

// ==========================
// URL
// ==========================

const params = new URLSearchParams(window.location.search);

const path = params.get("path") || "";

// ==========================
// DOM
// ==========================

const pageTitle =
document.getElementById("pageTitle");

const cardContainer =
document.getElementById("cardContainer");

const searchInput =
document.getElementById("searchInput");

// ==========================
// PAGE NAME
// ==========================

const pageName = path
.split("/")
.pop()
.replace(/-/g," ")
.replace(/\b\w/g,c=>c.toUpperCase());

pageTitle.textContent = pageName;

// ==========================
// SEO
// ==========================

document.title =
pageName +
" | PYQ Quiz Master";

document.querySelector('meta[name="description"]')
.setAttribute(
"content",
"Practice " +
pageName +
" previous year questions and mock tests."
);

document.querySelector('meta[name="keywords"]')
.setAttribute(
"content",
pageName +
", PYQ, Mock Test"
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
// DATA
// ==========================

let items=[];

// ==========================
// LOAD
// ==========================

load();

async function load(){

try{

const response=
await fetch(`data/${path}/exams.json`);

if(response.ok){

items=await response.json();

showCards(items);

return;

}

}catch(e){}

window.location.href=
`tests.html?path=${path}`;

}

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

${item.description || ""}

</p>

<a
class="btn"
href="browse.html?path=${path}/${item.folder}">

Open

</a>

</div>

`;

});

cardContainer.innerHTML=html;

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
items.filter(item=>

item.name
.toLowerCase()
.includes(keyword)

);

showCards(filtered);

});

}
