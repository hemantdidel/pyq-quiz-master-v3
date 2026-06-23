import {
    db,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    serverTimestamp
} from "./firebase.js";

const saveBtn = document.getElementById("saveScoreBtn");
const playerName = document.getElementById("playerName");
const leaderboardList = document.getElementById("leaderboardList");
const yourRank = document.getElementById("yourRank");

const result = JSON.parse(localStorage.getItem("quiz_result"));

if (!result) {
    leaderboardList.innerHTML = "Result Not Found";
}

async function saveScore() {

    let name = playerName.value.trim();

    if (name === "") {

        alert("Please Enter Your Name");

        return;

    }

    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";

    await addDoc(collection(db, "leaderboard"), {

        name: name,

        score: result.score,

        total: result.total,

        percentage: Number(
            ((result.score / result.total) * 100).toFixed(1)
        ),

        createdAt: serverTimestamp()

    });

    localStorage.setItem("student_name", name);

    saveBtn.innerText = "Saved ✓";

    loadLeaderboard();

}

async function loadLeaderboard() {

    leaderboardList.innerHTML = "Loading...";

    const q = query(

    collection(db, "leaderboard"),

    orderBy("score", "desc"),

    limit(50)

);

    const snapshot = await getDocs(q);

    let html = "";

    let rank = 1;

    snapshot.forEach(doc => {

        const data = doc.data();

        html += `

        <div style="
        display:flex;
        justify-content:space-between;
        padding:10px;
        border-bottom:1px solid #eee;
        ">

        <span>

        #${rank}

        ${data.name}

        </span>

        <span>

        ${data.score}/${data.total}

        </span>

        </div>

        `;

        if (

            localStorage.getItem("student_name") == data.name

        ) {

            yourRank.innerHTML =

                "🏆 Your Rank : #" + rank;

        }

        rank++;

    });

    leaderboardList.innerHTML = html;

}

saveBtn.addEventListener("click", saveScore);

loadLeaderboard();
