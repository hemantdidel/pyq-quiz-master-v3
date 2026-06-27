"use strict";

/* ===========================
   URL PARAMS
=========================== */

const params = new URLSearchParams(window.location.search);

const category = params.get("category");
const exam = params.get("exam");

// ===========================
// Dynamic SEO
// ===========================

const examName =
exam
.replace(/-/g," ")
.replace(/\b\w/g,c=>c.toUpperCase());

document.title =
examName + " | PYQ Quiz Master";

document.querySelector('meta[name="description"]')
.setAttribute(
"content",
"Practice " +
examName +
" previous year papers, mock tests, MCQs and online quizzes for free."
);

document.querySelector('meta[name="keywords"]')
.setAttribute(
"content",
examName +
", PYQ, Previous Year Questions, Mock Test, Online Quiz"
);

const canonical =
document.querySelector('link[rel="canonical"]');

if(canonical){

canonical.href =
window.location.origin +
window.location.pathname +
"?category=" +
category +
"&exam=" +
exam;

}
/* ===========================
   DOM
=========================== */

const pageTitle = document.getElementById("pageTitle");
const examContainer = document.getElementById("examContainer");
const searchInput = document.getElementById("searchInput");

/* ===========================
   PAGE TITLE
=========================== */

pageTitle.textContent = exam
    ? exam.replace(/-/g, " ").toUpperCase()
    : "EXAMS";

/* ===========================
   DATA
=========================== */

let list = [];

/* ===========================
   LOAD EXAMS
=========================== */

fetch(`data/${category}/${exam}/exams.json`)
    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to load data");
        }

        return response.json();

    })

    .then(data => {

        list = data;
        showCards(list);

    })

    .catch(error => {

        console.log(error);

        examContainer.innerHTML = `
            <div class="card">
                <h2>No Data Found</h2>
                <p>Exam list is not available.</p>
            </div>
        `;

    });

/* ===========================
   SHOW CARDS
=========================== */

function showCards(data){

    let html="";

    data.forEach(item=>{

        const title =
            item.title || item.name || "Untitled";

        const description =
            item.description ||
            item.folder.replace(/-/g," ").toUpperCase();

        html+=`

        <div class="card">

            <h2>${title}</h2>

            <p>${description}</p>

            <a
            class="btn"
            href="tests.html?category=${category}&exam=${exam}&post=${item.folder}">

            Open

            </a>

        </div>

        `;

    });

    examContainer.innerHTML=html;

}

/* ===========================
   SEARCH
=========================== */

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value
            .trim()
            .toLowerCase();

        const filtered=list.filter(item=>{

    const title =
        item.title || item.name || "";

    return title.toLowerCase().includes(keyword);

});

showCards(filtered);

    });

}
