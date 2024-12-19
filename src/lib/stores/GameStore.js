import { writable, readable, get } from 'svelte/store';

// Letters Store
export const lettersStore = readable([
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
]);

// Game state stores
export let started = writable(false);
export let turn = writable(0);
export let go = writable(0);
export let won = writable(false);
export let gameFinished = writable(false);

// List of answers
let answers = [
    'chart',
    'sauce',
    'doggo',
    'pizza',
    'beans',
    'image',
    'mappy',
    'carto',
    'color',
    'pixel',
    'music',
    'codes',
    'huggy',
    'smile',
    'happy',
    'laugh',
    'movie',
    'lager',
    'farty',
    'funny',
    'sexxy',
    'fuzzy',
    'cooks',
    'yours',
    'stink',
    'pasta',
    'bread',
    'beers',
    'great',
    'games',
    'skate',
    'tacos',
    'queso',
    'chips'

];

// Helper to get localStorage safely
export function getFromLocalStorage(key) {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
    return [];
}

function setToLocalStorage(key, value) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

// Function to generate a new random answer
function generateRandomAnswer() {
    let usedAnswers = getFromLocalStorage('usedAnswers');
    let availableAnswers = answers.filter(answer => !usedAnswers.includes(answer));

    if (availableAnswers.length === 0) {
        gameFinished.set(true);
        return null; // No more answers available
    }

    let randomIndex = Math.floor(Math.random() * availableAnswers.length);
    let newAnswer = availableAnswers[randomIndex].toUpperCase().split('');

    // Add the answer to the used cache
    usedAnswers.push(availableAnswers[randomIndex]);
    setToLocalStorage('usedAnswers', usedAnswers);
    console.log(newAnswer);

    return newAnswer;
}

// Initialize the answer store
let initialAnswer = generateRandomAnswer();
export let answerStore = writable(initialAnswer || []);

// Create blank frames based on the current answer
function createBlankFrame(answer) {
    return Array(6).fill(null).map(() => Array(answer.length).fill(null));
}

let frameBlank = Array(6).fill(null).map(() => Array(get(answerStore).length).fill(null));
let frameClone = JSON.parse(JSON.stringify(frameBlank));
export let frameReset = readable(frameClone);
export let frameStore = writable(frameBlank);
export let guessStore = writable(frameClone);

// Function to reset the game
export function resetGame() {
    let newAnswer = generateRandomAnswer();
    if (newAnswer === null) {
        gameFinished.set(true);
        return;
    }

    answerStore.set(newAnswer); // Update the answer
    let newFrameBlank = createBlankFrame(newAnswer);
    frameStore.set(newFrameBlank); // Reset frameStore
    guessStore.set(newFrameBlank); // Reset guessStore
    turn.set(0); // Reset the turn
    go.set(0); // Reset input
    won.set(false); // Reset the winning state
}

// Clear all game data from localStorage
export function clearGameData() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('usedAnswers');
    }
}

export function logAnsweredQuestions() {
    let usedAnswers = getFromLocalStorage('usedAnswers');
    console.log("Answered Questions:", usedAnswers);
    console.log("Unanswered Questions:", answerStore);
}
