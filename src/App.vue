<script setup lang="ts">
import Game from "./components/game.vue";
import RivalGame from "./components/rival-game.vue";
</script>

<template>
  <div class="game__wrap">
    <RivalGame></RivalGame>
    <Game></Game>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.game__wrap {
  display: flex;
  gap: 15px;
}
</style>
