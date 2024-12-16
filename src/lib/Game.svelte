<script>
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    import { lettersStore, answerStore, frameStore, guessStore, turn, go, won, logAnsweredQuestions } from '$lib/stores/GameStore.js'


    let allowed = [];
    let wordValid = false;

    // Load valid word list
    onMount(async () => {
    try {
        const response = await fetch('/words.txt'); // Adjust the path if necessary
        if (!response.ok) throw new Error('Failed to fetch word list');

        const text = await response.text();
        allowed = text
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean)
            .map(item => item.toUpperCase());
    } catch (error) {
        console.error('Error loading word list:', error);
    }
});
    
    let answer = $answerStore;
    console.log(answer)

    let frame = get(frameStore);
    console.log(frame);

    let correctChars = [];
    let closeChars = [];
    let incorrectChars = [];

    function checkAnswer(char, row, index) {
        const answerClone = [...answer];  // Clone the answer to manipulate during checks
        
        if (wordValid && char === answer[index]) {
            // Correct character in the right position
            answerClone[index] = null;  // Mark this character as used for further checks
            return 'correct';
        } else if (wordValid && answerClone.includes(char)) {
            // Character is in the word but in the wrong position
            const answerIndex = answerClone.indexOf(char);
            if (answerIndex !== -1) {
                answerClone[answerIndex] = null; // Mark this character as used
                return 'close';
            }
        } else if (wordValid) {
            return 'incorrect'; // Character not in the word at all
        }
    }

    function processRow(row) {
    let word = row.join('').toUpperCase(); // Convert the row to a string
    let answerStr = $answerStore.join('').toUpperCase(); // Get the current answer
    let guessCache = []; // To store results for this guess

    if (word === answerStr) {
        won.set(true); // Set the game to "won"
        console.log("You won!");
        const initialFrame = Array(6).fill(null).map(() => Array(5).fill(null));
        frame = initialFrame;
        return; // Exit as the game is complete
    }

    // Validate word
    wordValid = allowed.includes(word); // Check against allowed words list
    wordInvalid();

    if (wordValid) {
        row.forEach((char, index) => {
            let result = checkAnswer(char, row, index);
            guessCache.push(result); // Push the result for each character
        });

        // Update stores
        guessStore.update(guesses => {
            guesses[$turn] = guessCache; // Save the current guess
            return guesses;
        });

        turn.update(n => n + 1); // Move to the next turn
        go.set(0); // Reset character input for the new turn
    } else {
        console.warn('Invalid word:', word);
    }
}



function wordInvalid() {
    if (!wordValid) {
        document.querySelectorAll('.shaker').forEach((element) => {
            element.classList.add('invalid');
            setTimeout(() => element.classList.remove('invalid'), 800);
        });
    }
}


    function updateButtonClasses() {
        if(wordValid) {  // Directly check the global wordValid variable
            const buttons = document.querySelectorAll('.button');
            buttons.forEach(button => {
                const char = button.id;

                // Remove existing classes
                button.classList.remove('correct', 'close', 'incorrect', 'default');
                if (correctChars.includes(char)) {
                    button.classList.add('correct');
                } else if (closeChars.includes(char)) {
                    button.classList.add('close');
                } else if (incorrectChars.includes(char)) {
                    button.classList.add('incorrect');
                } else {
                    button.classList.add('default');
                }
            });
        }
    }

    function typeChar(char) {
        const noneChar = ['ENTER', 'DEL'];

        if ($go < 5 && !noneChar.includes(char)) {
            frame[$turn][$go] = char;  
            $go++;
        }

        if (char === 'DEL' && $go > 0) {
            $go--;
            frame[$turn][$go] = null;
        }

        if ($go === 5 && char === 'ENTER') {
            processRow(frame[$turn]); // Check answers for the row
        }

    }
</script>

<section class="container">

    {#each frame as row, rowIndex}
        <div class="row {rowIndex === $turn ? 'shaker' : ''} ">
            {#each row as char, charIndex}
                <div
                    class="cell {rowIndex < $turn ? checkAnswer(char, frame[rowIndex], charIndex) : ''} {rowIndex === $turn ? 'active' : ''} {rowIndex < $turn ? 'played' : ''}">
                    {char}
                </div>
            {/each}
        </div>
    {/each}
</section>
<h3 class="validWord shaker">Not in word list!</h3>
<section class="keyboard">
    {#each $lettersStore as row}
        <div class="keys">
            {#each row as key}
                <button type="button" id={key} class="button" on:click={() => typeChar(key)}>
                    {key}
                </button>
            {/each}
        </div>
    {/each}
</section>
<button class="button" on:click={() => logAnsweredQuestions()}>Log Answered Questions</button>


<style>
:root {
    --correct: rgb(137, 189, 137);
    --close: rgb(218, 198, 46);
    --answer-gray: rgb(221, 221, 221);
}

.container {
    width: auto;
    margin: auto;
}

.keyboard {
    max-width: 350px;
    margin: auto;
    bottom: 1;
}

.row {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
    pointer-events: none;
}

.cell {
    background-color: rgb(249, 249, 249);
    padding: 15px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid rgb(229, 229, 229);
    outline: rgb(0, 0, 0) none 0px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
    text-align: center;
}

.active {
    border: 2px solid rgb(150, 150, 150);
}

.played {
    background-color: var(--answer-gray);
}

.correct {
    background-color: var(--correct) !important;
}

.close {
    background-color: var(--close) !important;
}

.incorrect {
    background-color: var(--answer-gray) !important;
}

@keyframes jitter {
    10%,
  90% {
    transform: translateX(-1px);
  }

  20%,
  80% {
    transform: translateX(2px);
  }

  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }

  40%,
  60% {
    transform: translateX(4px);
  }
}

.validWord {
    text-align: center;
    color: rgb(150, 2, 2);
    visibility: hidden;
    margin: 5px 0 5px 0;
}

.invalid {
    animation: jitter .5s ease-in-out; /* Flashing animation */
    visibility: visible;
}

.keys {
    display: flex;
    justify-content: center;
    gap: 2px;
    margin-bottom: 2px;
}

.button {
    border: none;
    width: 35px;
    height: 50px;
    background-color: rgb(173, 172, 174);
    color: white;
    padding: 10px;
    font-size: 1.2em;
    font-weight: bold;
    touch-action: manipulation;
    border-radius: 4px;
}

#ENTER, #DEL {
    width: 90px;
    background-color: rgb(143, 141, 141);
}

.button:hover {
    background-color: rgba(112, 103, 120, 0.5);
}
</style>
