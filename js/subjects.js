const container = document.getElementById("subjectContainer");

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
