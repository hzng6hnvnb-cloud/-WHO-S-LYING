// ========================================
// WHO'S LYING?
// Main Game Logic
// ========================================

const places = [
    {
        name: "AIRPORT ✈️",
        description: "A busy place where people travel.",
        icon: "✈️"
    },
    {
        name: "HOSPITAL 🏥",
        description: "A place where people receive medical care.",
        icon: "🏥"
    },
    {
        name: "SCHOOL 🏫",
        description: "A place where students learn.",
        icon: "🏫"
    },
    {
        name: "RESTAURANT 🍔",
        description: "A place where people go to eat.",
        icon: "🍔"
    },
    {
        name: "BEACH 🏖️",
        description: "A place with sand and water.",
        icon: "🏖️"
    },
    {
        name: "CINEMA 🎬",
        description: "A place where people watch movies.",
        icon: "🎬"
    },
    {
        name: "GYM 🏋️",
        description: "A place where people exercise.",
        icon: "🏋️"
    },
    {
        name: "SUPERMARKET 🛒",
        description: "A place where people buy groceries.",
        icon: "🛒"
    }
];

let players = [];
let liarIndex = -1;
let currentPlayer = 0;
let currentRound = 1;
let totalRounds = 3;
let selectedVote = -1;
let currentPlace = null;

let timerInterval = null;
let questionTime = 60;


// ========================================
// PAGE SYSTEM
// ========================================

function showPage(id) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(id);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo(0, 0);
}


// ========================================
// HOME
// ========================================

function goHome() {
    showPage("home");
}

function showSetup() {
    showPage("setup");
}


// ========================================
// RULES
// ========================================

function showRules() {
    document.getElementById("rulesModal").classList.add("show");
}

function closeRules() {
    document.getElementById("rulesModal").classList.remove("show");
}


// ========================================
// PLAYERS
// ========================================

function addPlayer() {

    const list = document.getElementById("playersList");

    const rows = list.querySelectorAll(".player-row");

    if (rows.length >= 10) {
        alert("Maximum 10 players.");
        return;
    }

    const number = rows.length + 1;

    const row = document.createElement("div");

    row.className = "player-row";

    row.innerHTML = `
        <b>${String(number).padStart(2, "0")}</b>

        <input
            type="text"
            placeholder="Player name"
            maxlength="20"
        >
    `;

    list.appendChild(row);

    updatePlayerCount();
}


function updatePlayerCount() {

    const count =
        document.querySelectorAll(
            "#playersList .player-row"
        ).length;

    document.getElementById("playerCount").textContent =
        `${count} / 10`;
}


// ========================================
// ROUNDS
// ========================================

function selectRounds(number, button) {

    totalRounds = number;

    document.querySelectorAll(".round").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}


// ========================================
// START GAME
// ========================================

function startGame() {

    const inputs =
        document.querySelectorAll(
            "#playersList input"
        );

    players = [];

    inputs.forEach((input, index) => {

        const name =
            input.value.trim() ||
            `Player ${index + 1}`;

        players.push({
            name: name,
            score: 0
        });

    });

    if (players.length < 3) {
        alert("You need at least 3 players.");
        return;
    }

    currentRound = 1;

    startRound();
}


// ========================================
// START ROUND
// ========================================

function startRound() {

    currentPlace =
        places[Math.floor(Math.random() * places.length)];

    liarIndex =
        Math.floor(Math.random() * players.length);

    currentPlayer = 0;

    document.getElementById("currentRound").textContent =
        currentRound;

    showPassScreen();
}


// ========================================
// SECRET PASS
// ========================================

function showPassScreen() {

    const player =
        players[currentPlayer];

    document.getElementById("passPlayer").textContent =
        player.name;

    showPage("pass");
}


// ========================================
// SECRET
// ========================================

function showSecret() {

    const isLiar =
        currentPlayer === liarIndex;

    const icon =
        document.getElementById("secretIcon");

    const title =
        document.getElementById("secretTitle");

    const content =
        document.getElementById("secretContent");

    const description =
        document.getElementById("secretDescription");

    const label =
        document.getElementById("secretLabel");

    if (isLiar) {

        icon.textContent = "🚨";

        label.textContent =
            "YOUR ROLE";

        title.textContent =
            "YOU ARE THE LIAR";

        content.textContent =
            "YOU DON'T KNOW THE LOCATION";

        description.textContent =
            "Listen carefully and try to figure out the location without getting caught.";

    } else {

        icon.textContent =
            currentPlace.icon;

        label.textContent =
            "YOUR SECRET";

        title.textContent =
            "THE LOCATION";

        content.textContent =
            currentPlace.name;

        description.textContent =
            currentPlace.description;
    }

    showPage("secret");
}


// ========================================
// NEXT SECRET PLAYER
// ========================================

function nextSecret() {

    currentPlayer++;

    if (currentPlayer < players.length) {

        showPassScreen();

        return;
    }

    document.getElementById("currentRound").textContent =
        currentRound;

    showPage("roundStart");
}


// ========================================
// QUESTIONS
// ========================================

function startQuestions() {

    document.getElementById("questionRound").textContent =
        currentRound;

    questionTime = 60;

    document.getElementById("questionTimer").textContent =
        questionTime;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        questionTime--;

        document.getElementById("questionTimer").textContent =
            questionTime;

        if (questionTime <= 0) {

            clearInterval(timerInterval);

            startVoting();
        }

    }, 1000);

    showPage("questions");
}


// ========================================
// VOTING
// ========================================

function startVoting() {

    clearInterval(timerInterval);

    selectedVote = -1;

    const container =
        document.getElementById("votePlayers");

    container.innerHTML = "";

    players.forEach((player, index) => {

        const button =
            document.createElement("button");

        button.className =
            "vote-player";

        button.textContent =
            player.name;

        button.onclick = () =>
            selectVote(index, button);

        container.appendChild(button);
    });

    document.getElementById("voteRound").textContent =
        currentRound;

    const voteButton =
        document.getElementById("voteButton");

    voteButton.disabled = true;
    voteButton.classList.add("disabled");

    showPage("voting");
}


function selectVote(index, button) {

    selectedVote = index;

    document.querySelectorAll(".vote-player")
        .forEach(btn => {
            btn.classList.remove("selected");
        });

    button.classList.add("selected");

    const voteButton =
        document.getElementById("voteButton");

    voteButton.disabled = false;
    voteButton.classList.remove("disabled");
}


// ========================================
// RESULT
// ========================================

function submitVote() {

    if (selectedVote === -1) {
        return;
    }

    const resultName =
        document.getElementById("resultName");

    const resultPlace =
        document.getElementById("resultPlace");

    resultName.textContent =
        players[liarIndex].name;

    resultPlace.textContent =
        currentPlace.name;

    if (selectedVote === liarIndex) {

        players[selectedVote].score += 2;

    } else {

        players[selectedVote].score += 0;
    }

    createLastChance();

    showPage("result");
}


// ========================================
// LAST CHANCE
// ========================================

function createLastChance() {

    const container =
        document.getElementById("placeChoices");

    container.innerHTML = "";

    const shuffled =
        [...places]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

    if (!shuffled.some(place =>
        place.name === currentPlace.name
    )) {

        shuffled[0] = currentPlace;
    }

    shuffled
        .sort(() => Math.random() - 0.5)
        .forEach(place => {

            const button =
                document.createElement("button");

            button.textContent =
                place.name;

            button.onclick = () => {

                if (place.name === currentPlace.name) {

                    button.classList.add("correct");

                    players[liarIndex].score += 3;

                    alert(
                        "Correct! The liar guessed the location."
                    );

                } else {

                    button.classList.add("wrong");

                    alert(
                        "Wrong guess!"
                    );
                }

                document
                    .querySelectorAll(
                        "#placeChoices button"
                    )
                    .forEach(btn => {
                        btn.disabled = true;
                    });
            };

            container.appendChild(button);
        });
}


// ========================================
// NEXT ROUND
// ========================================

function nextRound() {

    if (currentRound >= totalRounds) {

        showFinal();

        return;
    }

    currentRound++;

    startRound();
}


// ========================================
// FINAL RESULTS
// ========================================

function showFinal() {

    const container =
        document.getElementById("finalScores");

    container.innerHTML = "";

    const sorted =
        [...players]
            .sort((a, b) => b.score - a.score);

    sorted.forEach((player, index) => {

        const row =
            document.createElement("div");

        row.className = "score";

        row.innerHTML = `
            <span>
                ${index + 1}. ${player.name}
            </span>

            <strong>
                ${player.score} pts
            </strong>
        `;

        container.appendChild(row);
    });

    showPage("final");
}


// ========================================
// RESTART
// ========================================

function restartGame() {

    currentRound = 1;
    selectedVote = -1;

    players.forEach(player => {
        player.score = 0;
    });

    showSetup();
}


// ========================================
// INITIALIZE
// ========================================

updatePlayerCount();
