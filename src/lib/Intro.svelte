<script>
    import { started } from '$lib/stores/GameStore.js'

    function startGame() {
        $started = true;
    }

</script>


{#if $started === false}
    <section class="splash">
        <div class="content">
            <h1>Lou-dle</h1>
            <h3>Go ahead, play your favourite<br>Lou based Wordle clone.</h3>
            <button class="button" on:click={() => startGame()}>Play</button>
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
        background-color: rgb(226, 226, 226);
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
    


</style>