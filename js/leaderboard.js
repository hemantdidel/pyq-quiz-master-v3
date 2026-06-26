import {
    db,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    updateDoc,
    doc,
    serverTimestamp,
    onSnapshot
} from "./firebase.js";

/* ==========================================
   DOM
========================================== */

const saveBtn = document.getElementById("saveScoreBtn");
const leaderboardList = document.getElementById("leaderboardList");
const yourRank = document.getElementById("yourRank");
const playerNameText = document.getElementById("playerNameText");

/* ==========================================
   RESULT
========================================== */

const result = JSON.parse(localStorage.getItem("quiz_result"));

if (!result) {
    window.location.href = "index.html";
}

playerNameText.textContent = result.playerName;

/* ==========================================
   SAVE / UPDATE SCORE
========================================== */

async function saveScore() {
    if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";
}

    const leaderboardRef = collection(db, "leaderboard");

    const q = query(
        leaderboardRef,
        where("playerId", "==", result.playerId),
        where("testId", "==", result.testId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        // New Record

        await addDoc(leaderboardRef, {

            playerId: result.playerId,
            name: result.playerName || localStorage.getItem("player_name") || "Unknown",

            testId: result.testId,

            score: result.score,
            total: result.total,

            percentage:
                Number(
                    (
                        result.score /
                        result.total *
                        100
                    ).toFixed(1)
                ),

            timeTaken: result.timeTaken,

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()

        });

    } else {

        // Existing Record

        const oldDoc = snapshot.docs[0];

        const oldData = oldDoc.data();

        const betterScore =
            result.score > oldData.score;

        const sameScoreBetterTime =
            result.score === oldData.score &&
            result.timeTaken < oldData.timeTaken;

        if (betterScore || sameScoreBetterTime) {

            await updateDoc(doc(db,
                "leaderboard",
                oldDoc.id
            ), {
    playerId: result.playerId,
    testId: result.testId,

    name: result.playerName || localStorage.getItem("player_name") || "Unknown",

    score: result.score,
    total: result.total,

    percentage: Number(
        ((result.score / result.total) * 100).toFixed(1)
    ),

    timeTaken: result.timeTaken,

    updatedAt: serverTimestamp()
});

        }

    }
    
    if (saveBtn) {
    saveBtn.innerText = "Saved ✓";
    saveBtn.disabled = true;
}

}
/* ==========================================
   LIVE LEADERBOARD
========================================== */

function loadLeaderboard() {

    const leaderboardRef = collection(db, "leaderboard");

    const q = query(
        leaderboardRef,
        orderBy("score", "desc"),
        orderBy("timeTaken", "asc"),
        limit(100)
    );

    onSnapshot(q, (snapshot) => {

        let html = "";

        let rank = 1;

        let found = false;

        snapshot.forEach((item) => {

            const data = item.data();

            let medal = "";

            if (rank === 1) medal = "🥇";
            else if (rank === 2) medal = "🥈";
            else if (rank === 3) medal = "🥉";

            html += `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:12px;
                    border-bottom:1px solid #eee;
                ">

                    <div>
                        <strong>${medal} #${rank}</strong>
                        &nbsp;
                        ${data.name}
                    </div>

                    <div>
                        ${data.score}/${data.total}
                        <br>
                        <small>${data.percentage}%</small>
                    </div>

                </div>
            `;

            if (
                data.playerId === result.playerId &&
                data.testId === result.testId
            ) {

                yourRank.innerHTML =
                    `🏆 Your Rank : #${rank}`;

                found = true;

            }

            rank++;

        });

        if (!found) {
            yourRank.innerHTML = "Rank will appear after saving.";
        }

        leaderboardList.innerHTML =
            html || "No Records Found.";

    });

}
/* ==========================================
   AUTO SAVE + INIT
========================================== */

// Save बटन क्लिक
function initLeaderboard() {

    const result = JSON.parse(localStorage.getItem("quiz_result"));

    if (!result) {
        console.error("No quiz result found");
        return;
    }

    window.addEventListener("load", async () => {

        try {
            await saveScore();
            loadLeaderboard();
        } catch (err) {
            console.error(err);
        }

    });
}

initLeaderboard();
