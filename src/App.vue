<script setup lang="ts">
import Game from "./components/game.vue";
import RivalGame from "./components/rival-game.vue";
import { createGame, GameMode } from "./game";
import config from "./common/config";
import { MySelf, PlayerState, Rival } from "./common/player";
import { inject, ref, watch } from "vue";
import { information } from "./common/utils";

const game: Game = createGame(Object.assign({ passive: false }, config));
const rivalGame: Game = createGame(Object.assign({ passive: true }, config));

const player = new MySelf(game, () => {
  if (game.mode === GameMode.multiple) {
    rival.endGame();
    if (game.score >= rivalGame.score) {
      alert("You Win");
    } else {
      alert("You Lose");
    }
  }
});
const rival = new Rival(rivalGame);

const { state: rivalState, onlineState: rivalOnlineState } = rival;
const { state } = player;

// 连接断开后，修改对手状态
watch(inject("connectState"), (value) => {
  if (!value) {
    rival.onlineState = false;
  }
});

const connectState = inject("connectState");

const gameMode = ref(GameMode.single);
const onGameModeChange = (mode: GameMode) => {
  if (state.value === PlayerState.started) {
    return information("游戏运行中不可以切换模式");
  }
  gameMode.value = mode;
};
</script>

<template>
  <div class="game__wrap" style="display: none">
    <RivalGame :game="rivalGame" :rival="rival">
      <template #head>
        <div class="game__icon-bar">
          <div
            class="iconfont icon-connect"
            :class="{ 'icon-true': connectState, 'icon-false': !connectState }"
          ></div>
          <div
            class="iconfont icon-true"
            :class="{
              'icon-online icon-true': rivalOnlineState,
              'icon-offline icon-false': !rivalOnlineState,
            }"
          ></div>
        </div>
      </template>
      <template #bottom>
        <div class="game__mode">
          <div
            :class="{
              'game__mode-item--selected': gameMode === GameMode.single,
            }"
            @click="onGameModeChange(GameMode.single)"
          >
            单人
          </div>
          <div
            :class="{
              'game__mode-item--selected': gameMode === GameMode.multiple,
            }"
            @click="onGameModeChange(GameMode.multiple)"
          >
            双人
          </div>
        </div>

        <div v-if="gameMode === GameMode.single" class="game__control-buttons">
          <button
            v-if="
              state === PlayerState.ended || state === PlayerState.unStarted
            "
            @click="player.start(GameMode.single)"
          >
            开始
          </button>
          <button v-if="state === PlayerState.started" @click="player.pause">
            暂停
          </button>
          <button
            v-if="state === PlayerState.paused"
            @click="player.continueGame"
          >
            继续
          </button>
          <button v-if="state === PlayerState.started" @click="player.endGame">
            结束
          </button>
        </div>

        <div
          v-if="gameMode === GameMode.multiple"
          class="game__control-buttons"
        >
          <button
            v-if="rivalState === PlayerState.readied"
            @click="
              player.start(GameMode.multiple);
              rival.start(GameMode.multiple);
            "
          >
            开始
          </button>
          <button
            v-if="
              state !== PlayerState.started &&
              rivalState !== PlayerState.readied
            "
            @click="player.ready"
          >
            {{ state === PlayerState.readied ? "已" : "" }}准备
          </button>
        </div>
      </template>
    </RivalGame>
    <Game :game="game" :player="player" :rival="rival"></Game>
  </div>
</template>

<style lang="scss">
.game__wrap {
  display: flex;
  gap: 15px;
}
.game__icon-bar {
  display: flex;
  justify-content: center;
  .iconfont {
    font-size: 22px;
  }
}
.game__mode {
  background: #fff;
  border-radius: 20px;
  display: flex;
  cursor: pointer;
  > div {
    padding: 5px;
    text-align: center;
    flex: 1 0 0;
  }
  > div:first-child {
    border-right: 1px solid #000;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  > div:last-child {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
  .game__mode-item--selected {
    background: blue;
    color: #fff;
  }
}
.game__control-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  button {
    padding: 5px;
    width: 100%;
    border-radius: 20px;
    border: 1px lightblue solid;
    background: #fff;
    outline: none;
  }
}
</style>
