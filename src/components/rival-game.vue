<script setup lang="ts">
import Map from "./map.vue";
import { inject } from "vue";
import { createGame } from "../game";
import config from "../common/config";
import { Rival } from "../common/player";

const game = createGame(Object.assign({}, config, { passive: true }));
const { map, score } = game;
const rival = new Rival(game);

const enterRoomState = inject("enterRoomState");
const connectState = inject("connectState");
const rivalEnterRoomState = inject("rivalEnterRoomState");
</script>

<template>
  <div class="coordinator-game">
    <div class="coordinator-game__side">
      <div>{{ connectState ? "已连接" : "未连接" }}</div>
      <div>{{ enterRoomState ? "进入房间" : "未进入房间" }}</div>
      <div>{{ rivalEnterRoomState ? "朋友在线" : "朋友离线" }}</div>
      <div>{{ score }}</div>
    </div>
    <Map :map="map"></Map>
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
