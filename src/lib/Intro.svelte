<script>
    import { started, getFromLocalStorage } from '$lib/stores/GameStore.js'

    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    function startGame() {
        $started = true;
    }

    let goes = getFromLocalStorage('usedAnswers').length;

</script>


{#if $started === false}
    <section class="splash">
        <div class="content">
            <img src='/wordle-icon.svg' alt="logo" />
            <h1>Lou-dle</h1>
            <p>Get 6 chances to guess a<br>5-letter word based<br>around Lou!</p>
            <button class="button" on:click={() => startGame()}>Play</button>
            <br><br>
            <b>{formattedDate}</b><br><br>
            <p class="reg">No. {goes}</p>
            <p class="reg">Edited by Lou Robinson</p>
        </div>
    </section>
{/if}

<style>
    :root {
        --correct: rgb(137, 189, 137);
        --close: rgb(218, 198, 46);
        --answer-gray: rgb(221, 221, 221);
        --wordle-icon: '/wordle-icon.svg';
    }

    .splash {
        position: absolute;
        background-color: #E3E3E1;
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
        padding-top: 120px;
        max-width: 400px;
        margin: auto;
        text-align: center;
        font-family: "Roboto Slab", serif;
        font-optical-sizing: auto;
        font-weight: 100;
        animation: jitter .45s linear; /* Flashing animation */
    }

    .content p {
        font-size: 1.8em;
        font-weight: 200;
    }

    .reg {
        font-size: 1.1em !important;
        margin: 0;
    }

    .logo {
        height: 64px;
        margin-bottom: 16px;
        display: block;
        width: 100%;
        text-align: center;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }

    h1 {
        font-family: "Roboto Slab", serif;
        font-optical-sizing: auto;
        font-weight: 800;
        font-style: normal;
        text-align: center;
        font-size: 3em;
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
    


</style>