<script setup lang="ts">
import Map from "./map.vue";
import { Game } from "../game";
import { Player, Rival } from "../common/player";

const props = defineProps<{
  game: Game;
  rival: Rival;
}>();
const { map, score } = props.game;
const { onlineState } = props.rival;
</script>

<template>
  <div class="rival-game">
    <div class="rival-game__side">
      <slot name="head"></slot>
      <div v-if="onlineState" class="rival-game__score">分数：{{ score }}</div>
      <slot name="prop"></slot>
      <slot name="bottom"></slot>
    </div>
    <Map :map="map"></Map>
  </div>
</template>

<style lang="scss" scoped>
.rival-game {
  display: flex;

  &__score {
    padding: 0.1rem 0;
    text-align: center;
  }

  &__side {
    padding-right: 0.1rem;
    width: 1.2rem;
  }
}
</style>
