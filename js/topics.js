"use strict";

const params = new URLSearchParams(window.location.search);

const path = params.get("path");

const pageTitle = document.getElementById("pageTitle");
const topicContainer = document.getElementById("topicContainer");

if (!path) {

    pageTitle.textContent = "Topics";

    topicContainer.innerHTML =
    "<h2>No Path Found</h2>";

    throw new Error("Missing Path");

}

// SEO

const lastName =
path
.split("/")
.pop()
.replace(/-/g," ")
.replace(/\b\w/g,c=>c.toUpperCase());

document.title =
lastName + " | PYQ Quiz Master";

document.querySelector('meta[name="description"]')
.setAttribute(
"content",
"Practice " + lastName + " topic wise mock tests."
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

// Page Title

pageTitle.textContent = lastName;

// Load Folder

fetch(`data/${path}/exams.json`)

.then(res=>{

if(!res.ok){

throw new Error();

}

return res.json();

})

.then(data=>{

showCards(data);

})

.catch(()=>{

window.location.href =
`tests.html?path=${path}`;

});

// Cards

function showCards(list){

let html="";

list.forEach(item=>{

html+=`

<div class="card">

<h2>

${item.icon || "📚"}

${item.name}

</h2>

<p>

${item.description || ""}

</p>

<a
class="btn"
href="topics.html?path=${path}/${item.folder}">

Open

</a>

</div>

`;

});

topicContainer.innerHTML=html;

}
