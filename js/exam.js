"use strict";

/* ===========================
   URL PARAMS
=========================== */

const params = new URLSearchParams(window.location.search);

const category = params.get("category");
const exam = params.get("exam");

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

function showCards(data) {

    let html = "";

    data.forEach(item => {

        html += `

        <div class="card">

            <h2>${item.title}</h2>

            <p>${item.folder.replace(/-/g, " ").toUpperCase()}</p>

            <a
                class="btn"
                href="tests.html?category=${category}&exam=${exam}&post=${item.folder}">
                Open
            </a>

        </div>

        `;

    });

    examContainer.innerHTML = html;

}

/* ===========================
   SEARCH
=========================== */

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value
            .trim()
            .toLowerCase();

        const filtered = list.filter(item =>

            item.title.toLowerCase().includes(keyword)

        );

        showCards(filtered);

    });

}
