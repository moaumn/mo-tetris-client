<script setup lang="ts">
import Map from "./map.vue";
import { createGame, GameState, initMap } from "../game";
import { reactive, watch } from "vue";
import { render } from "../game/renderer";
import config from "../common/config";
import { MySelf } from "../common/player";

const game = createGame(config);
const { map, score, state, startGame, nextBox } = game;

const player = new MySelf(game);
game.startGame();
// next
const nextMapLength = 6;
const nextMap = reactive(initMap(nextMapLength, nextMapLength));
watch(nextBox, (value) => {
  if (value) {
    const box = Object.assign({}, value);
    box.x = Math.trunc((nextMapLength - box.shape.length) / 2);
    box.y = Math.trunc((nextMapLength - box.shape[0].length) / 2);
    render(nextMap, box);
  }
});

function ready() {
  // state.value = GameState.readied;
}

function pauseGame() {
  state.value = GameState.paused;
}

function continueGame() {
  state.value = GameState.started;
}
</script>

<template>
  <div class="game">
    <Map :map="map"> </Map>
    <div class="game__side">
      <div class="game__next-box">
        <Map :map="nextMap" :size="10"></Map>
      </div>
      <div class="game__score">分数：{{ score }}</div>
      <div class="game__control-buttons">
        <button
          v-if="state === GameState.unStarted || state === GameState.ended"
          @click="startGame()"
        >
          {{ state === GameState.ended ? "重新" : "" }}开始
        </button>
        <button
          v-if="state === GameState.unStarted || state === GameState.ended"
          @click="ready()"
        >
          准备
        </button>
        <button v-if="state === GameState.started" @click="pauseGame">
          暂停
        </button>
        <button v-if="state === GameState.paused" @click="continueGame">
          继续
        </button>
      </div>
      <div v-if="state === GameState.started" class="game__buttons">
        <div>
          <button
            class="game__button rotate"
            @click="player.handleRotate"
          ></button>
          <button class="game__button" @click="player.handleMoveDown"></button>
        </div>
        <div>
          <button
            class="game__button left"
            @click="player.handleMoveLeft"
          ></button>
          <button
            class="game__button right"
            @click="player.handleMoveRight"
          ></button>
        </div>
        <button
          class="game__button next"
          @click="player.handleFallDown"
        ></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game {
  display: flex;
}
.game__score {
  text-align: center;
  margin-bottom: 15px;
}
.game__side {
  width: 130px;
  background: lightcoral;
  display: flex;
  flex-direction: column;
  padding: 15px;
}
.game__control-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  button {
    padding: 5px;
    width: 100%;
    border-radius: 20px;
    border: 1px lightblue solid;
    background: #fff;
    outline: none;
  }
}
.game__buttons {
  justify-self: flex-end;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.game__button {
  background: url("../assets/down.svg");
  border: none;
  background-size: 100% 100%;
  height: 40px;
  width: 40px;
  margin: 5px;

  &.rotate {
    background-image: url("../assets/rotate.svg");
  }
  &.left {
    transform: rotateZ(90deg);
  }
  &.right {
    transform: rotateZ(-90deg);
  }
  &.next {
    background-image: url("../assets/next.svg");
  }
}
.game__next-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}
</style>
