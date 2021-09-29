<script setup lang="ts">
import Map from "./map.vue";
import { Game } from "../game";
import { Player } from "../common/player";

const props = defineProps<{
  game: Game;
  rival: Player;
}>();
const { map, score } = props.game;
const { onlineState } = props.rival;
</script>

<template>
  <div class="rival-game">
    <div class="rival-game__side">
      <slot name="head"></slot>
      <div v-if="onlineState" class="rival-game__score">分数：{{ score }}</div>
      <slot name="bottom"></slot>
    </div>
    <Map :map="map"></Map>
  </div>
</template>

<style lang="scss" scoped>
.rival-game {
  display: flex;

  &__score {
    padding: 10px 0;
    text-align: center;
  }

  &__side {
    padding: 10px 10px 10px 10px;
    width: 120px;
    background: lightseagreen;
  }
}
</style>
