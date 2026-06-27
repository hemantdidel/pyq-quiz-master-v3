const container = document.getElementById("subjectContainer");
// ===========================
// SEO
// ===========================

document.title =
"Subject Wise Practice | PYQ Quiz Master";

document.querySelector('meta[name="description"]')
.setAttribute(
"content",
"Practice Rajasthan GK, India GK, Math, Science, Computer and Reasoning topic-wise with free online mock tests."
);

document.querySelector('meta[name="keywords"]')
.setAttribute(
"content",
"Rajasthan GK, India GK, Math, Reasoning, Science, Computer, Subject Wise MCQ"
);

const canonical =
document.querySelector('link[rel="canonical"]');

if(canonical){

canonical.href =
window.location.origin +
window.location.pathname;

}

fetch("data/subjects.json")
.then(res => res.json())
.then(subjects => {

let html = "";

subjects.forEach(subject => {

html += `

<div class="card">

<h2>${subject.icon} ${subject.title}</h2>

<a
class="btn"
href="topics.html?subject=${subject.folder}">

Open

</a>

</div>

`;

});

container.innerHTML = html;

})
.catch(() => {

container.innerHTML = `
<h2>Subjects Not Found</h2>
`;

});
