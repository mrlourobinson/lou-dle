<script>
    import Game from '../lib/Game.svelte'
    import Intro from '../lib/Intro.svelte'
    import Score from '../lib/Score.svelte'


    import '../app.css'
</script>
    

<h1>Lou-dle</h1>
<Intro />
<Game />
<Score />


<style>

h1 {
    font-family: "Roboto Slab", serif;
    font-optical-sizing: auto;
    font-weight: 800;
    font-style: normal;
    text-align: center;
    margin: 15px;
}
</style>