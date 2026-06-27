const params = new URLSearchParams(window.location.search);

const category = params.get("category");
const exam = params.get("exam");
const post = params.get("post");
// ===========================
// Dynamic SEO
// ===========================

const examName = exam
    ? exam.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : "";

const postName = post
    ? post.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : "Practice Sets";

document.title =
postName + " " + examName + " Mock Tests | PYQ Quiz Master";

document.querySelector('meta[name="description"]')
.setAttribute(
"content",
"Practice " +
postName +
" " +
examName +
" previous year questions, online mock tests, timer, leaderboard and detailed solutions for free."
);

document.querySelector('meta[name="keywords"]')
.setAttribute(
"content",
postName +
", " +
examName +
", PYQ, Mock Test, Previous Year Questions, MCQ"
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
exam +
"&post=" +
post;

}
const testContainer =
document.getElementById("testContainer");

const pageTitle =
document.getElementById("pageTitle");

pageTitle.innerHTML =
(post || "Practice Sets").toUpperCase();

fetch(`data/${category}/${exam}/${post}/tests.json`)

.then(response => response.json())

.then(data => {

showTests(data);

})

.catch(() => {

testContainer.innerHTML = `

<div class="card">

<h2>No Tests Found</h2>

<p>Please add tests.json</p>

</div>

`;

});

function showTests(list){

let html = "";

list.forEach((item,index)=>{

html += `

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

href="quiz.html?file=data/${category}/${exam}/${post}/${item.file}">

Start Test

</a>

</div>

`;

});

testContainer.innerHTML = html;

}
