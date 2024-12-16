<script>
    import { won, turn, go, guessStore, resetGame, frameStore, frameReset, gameFinished, clearGameData } from '$lib/stores/GameStore.js';
    import { tick } from 'svelte';
    import { get } from 'svelte/store';
    
    // Handle updates to the emoji grid
    async function updateEmojiArray(newArray) {
        emojiArray = newArray;
        await tick(); // Wait for the DOM to update
        console.log("Emoji grid updated!");
    }
    
    // Update the initial state
    won.set(false);
    let t = $turn;
    
    // Restart game logic
    function restartGame() {
        if ($gameFinished) {
            console.log("No more answers available. Game over!");
            return;
        }
        resetGame(); // Reset the game state
        console.log("Game reset complete!");
    }
    
    // Clear all stored game data
    function handleClearData() {
        clearGameData(); // Reset all progress
        location.reload(); // Reload to reset state fully
    }
    
    // Correct usage of guessStore and turn
    let guessResponse = $guessStore; // For initial value
    const replacements = {
        incorrect: '⬜',
        correct: '🟩',
        close: '🟨'
    };
    
    // Map game state to emoji grid
    $: emojiGrid = [...$guessStore].map(row =>
        row.map(item => {
            switch (item) {
                case 'correct':
                    return '🟩';
                case 'close':
                    return '🟨';
                case 'incorrect':
                    return '⬜';
                default:
                    return '';
            }
        })
    );
    
    let guessResponseString = guessResponse.join(' ');
    
    </script>
    
    {#if $gameFinished}
        <section class="splash">
            <div class="content">
                <h1>Game Over!</h1>
                <p>No more answers are available.</p>
                <button class="button" on:click={handleClearData}>Reset Game Data</button>
            </div>
        </section>
    {:else if $won === true}
        <section class="splash">
            <div class="content">
                <h1>You won!</h1>
                <div class="grid">
                    {#each emojiGrid as row, index}
                        {#if index <= t}
                            <div class="row">
                                {#each row as emoji}
                                    <div class="cell">{emoji}</div>
                                {/each}
                            </div>
                        {/if}
                    {/each}
                    <div class="row">
                        <div class="cell">🟩</div>
                        <div class="cell">🟩</div>
                        <div class="cell">🟩</div>
                        <div class="cell">🟩</div>
                        <div class="cell">🟩</div>
                    </div>
                </div>
                <h3>You did it in {$turn + 1} goes!</h3>
                <button class="button" on:click={() => restartGame()}>Play again?</button> 
            </div>
        </section>
    {/if}
    
    <style>
        :root {
            --correct: rgb(137, 189, 137);
            --close: rgb(218, 198, 46);
            --answer-gray: rgb(221, 221, 221);
        }
    
        .splash {
            position: absolute;
            background-color: rgb(251, 251, 251);
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
        }
    
        @keyframes jitter {
            0% {
                transform: translateY(-20px);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .content {
            transform: translateY(0px);
            padding-top: 50px;
            max-width: 400px;
            margin: auto;
            text-align: center;
            font-family: "Roboto Slab", serif;
            font-optical-sizing: auto;
            font-weight: 100;
            animation: jitter .45s linear; /* Flashing animation */
        }
    
        h1 {
            font-family: "Roboto Slab", serif;
            font-optical-sizing: auto;
            font-weight: 800;
            font-style: normal;
            text-align: center;
            margin: 15px;
        }
    
        .button {
            background-color: #262626;
            border: none;
            height: 3em;
            border-radius: 1.5em;
            align-content: center;
            letter-spacing: .05em;
            font-size: 20px;
            line-height: 28px;
            color: white;
            min-width: 200px;
            transition: 0.5s;
        }
    
        .button:hover {
            background-color: #454545;
        }
        
        .grid {
            display: flex;
            flex-direction: column;
            gap: 1px; /* Adjust spacing between rows */
            justify-content: center;
        }
        .row {
            display: flex;
            gap: 1px; /* Adjust spacing between emojis in a row */
            justify-content: center;
        }
        .cell {
            font-size: 24px; /* Adjust emoji size */
            text-align: center;
            width: 1.5em; /* Equalize cell width */
            height: 1.5em; /* Equalize cell height */
        }
    </style>
    