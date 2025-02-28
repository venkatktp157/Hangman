const maxAttempts = 6;
let selectedWord = "";
let guessedLetters = [];
let incorrectGuesses = 0;
let wordList = [];

const wordDisplay = document.getElementById("word-display");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");
const keyboard = document.getElementById("keyboard");
const hangmanImage = document.getElementById("hangman-image");

// ✅ Fetch words from CSV file
async function loadWords() {
    try {
        const response = await fetch("words.csv"); // Load CSV file
        const data = await response.text();
        wordList = data.split("\n").map(word => word.trim().toUpperCase()); // Convert to uppercase
        initializeGame();
    } catch (error) {
        console.error("Error loading words:", error);
    }
}

// ✅ Select a random word
function getRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

// ✅ Initialize Game
function initializeGame() {
    selectedWord = getRandomWord();
    guessedLetters = [];
    incorrectGuesses = 0;
    hangmanImage.src = `images/hangman0.png`; // Reset image
    message.textContent = "";
    restartBtn.style.display = "none";
    updateWordDisplay();
    createKeyboard();
}

// ✅ Update Word Display
function updateWordDisplay() {
    wordDisplay.textContent = selectedWord
        .split("")
        .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
        .join(" ");
}

// ✅ Create Keyboard Buttons
function createKeyboard() {
    keyboard.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        let letter = String.fromCharCode(i);
        let button = document.createElement("button");
        button.textContent = letter;
        button.onclick = () => handleGuess(letter);
        keyboard.appendChild(button);
    }
}

// ✅ Handle Letter Guess
function handleGuess(letter) {
    if (guessedLetters.includes(letter) || incorrectGuesses >= maxAttempts) return;

    guessedLetters.push(letter);

    if (selectedWord.includes(letter)) {
        updateWordDisplay();
        checkWin();
    } else {
        incorrectGuesses++;
        hangmanImage.src = `images/hangman${incorrectGuesses}.png`; // Update Hangman image
        checkLoss();
    }
}

// ✅ Check Win Condition
function checkWin() {
    if (!wordDisplay.textContent.includes("_")) {
        message.textContent = "🎉 Congratulations! You Won!";
        restartBtn.style.display = "block";
    }
}

// ✅ Check Loss Condition
function checkLoss() {
    if (incorrectGuesses >= maxAttempts) {
        message.textContent = `💀 Game Over! The word was: ${selectedWord.toUpperCase()}`;
        restartBtn.style.display = "block";
    }
}

// ✅ Restart Game
restartBtn.addEventListener("click", initializeGame);

// ✅ Load Words & Start Game
loadWords();
