const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");

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

pageTitle.innerHTML =
(subject || "Topics")
.replaceAll("-"," ")
.toUpperCase();

let html="";

(topics[subject] || []).forEach(item=>{

html+=`

<div class="card">

<h3>

${item.replaceAll("-"," ").toUpperCase()}

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
