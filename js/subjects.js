const subjects = [

{
title:"Rajasthan GK",
icon:"🏰",
folder:"rajasthan-gk"
},

{
title:"India GK",
icon:"🇮🇳",
folder:"india-gk"
},

{
title:"Maths",
icon:"🧮",
folder:"maths"
},

{
title:"Reasoning",
icon:"🧠",
folder:"reasoning"
},

{
title:"Science",
icon:"🔬",
folder:"science"
},

{
title:"Computer",
icon:"💻",
folder:"computer"
}

];

const container=document.getElementById("subjectContainer");

let html="";

subjects.forEach(item=>{

html+=`

<div class="card">

<h2>${item.icon} ${item.title}</h2>

<a class="btn"
href="topics.html?subject=${item.folder}">
Open
</a>

</div>

`;

});

container.innerHTML=html;
