const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");

// ===========================
// Dynamic SEO
// ===========================

const subjectName = subject
? subject.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
: "Subjects";

document.title =
subjectName + " Topics | PYQ Quiz Master";

document.querySelector('meta[name="description"]')
.setAttribute(
"content",
"Practice " +
subjectName +
" topic-wise mock tests, previous year questions, MCQs and quizzes for free."
);

document.querySelector('meta[name="keywords"]')
.setAttribute(
"content",
subjectName +
", Topic Wise, PYQ, Mock Test, MCQ, Practice Questions"
);

const canonical =
document.querySelector('link[rel="canonical"]');

if(canonical){

canonical.href =
window.location.origin +
window.location.pathname +
"?subject=" +
subject;

}

const pageTitle = document.getElementById("pageTitle");

const topicContainer = document.getElementById("topicContainer");

const topics = {

"rajasthan-gk":[
"history",
"geography",
"polity",
"economy",
"art-culture",
"current-affairs",
"mixed"
],

"india-gk":[
"history",
"geography",
"polity",
"economy",
"art-culture",
"current-affairs",
"mixed"
],

"maths":[
"percentage",
"ratio-proportion",
"average",
"profit-loss",
"time-work",
"time-distance",
"mensuration",
"algebra",
"mixed"
],

"reasoning":[
"analogy",
"coding-decoding",
"blood-relation",
"direction",
"alphabet",
"number-series",
"puzzle",
"mixed"
],

"science":[
"physics",
"chemistry",
"biology",
"environment",
"space-science",
"mixed"
],

"computer":[
"basics",
"hardware",
"software",
"internet",
"ms-office",
"networking",
"mixed"
]

};

pageTitle.textContent =
subjectName + " Topics";

let html="";

(topics[subject] || []).forEach(item=>{

html+=`

<div class="card">

<h3>
${item.replaceAll("-"," ").replace(/\b\w/g,c=>c.toUpperCase())}
</h3>

<a
class="btn"
href="tests.html?category=subject-wise&exam=${subject}&post=${item}">

Open Tests

</a>

</div>

`;

});

topicContainer.innerHTML=html;
