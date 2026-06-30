"use strict";

const USERNAME="admin";
const PASSWORD="112233";

document
.getElementById("loginBtn")
.onclick=function(){

const user=
document
.getElementById("username")
.value
.trim();

const pass=
document
.getElementById("password")
.value;

if(
user===USERNAME &&
pass===PASSWORD
){

sessionStorage.setItem(
"adminLoggedIn",
"true"
);

window.location.href="admin.html";

}else{

document
.getElementById("msg")
.textContent=
"Wrong Username or Password";

}

};
