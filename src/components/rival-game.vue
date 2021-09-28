<script setup lang="ts">
import Map from "./map.vue";
import { inject } from "vue";
import { createGame } from "../game";
import config from "../common/config";
import { Rival } from "../common/player";

const game = createGame(config);
const rival = new Rival(game);
game.startGame();

const inRoomState = inject("entryRoomState");
const connectState = inject("connectState");
</script>

<template>
  <div class="coordinator-game">
    <div class="coordinator-game__side">
      <div>{{ connectState ? "已连接" : "未连接" }}</div>
      <div>{{ inRoomState ? "进入房间" : "未进入房间" }}</div>
    </div>
    <Map :map="game.map"></Map>
  </div>
</template>

<style lang="scss" scoped>
.coordinator-game {
  display: flex;

  &__side {
    width: 100px;
    background: lightcoral;
  }
}
</style>
