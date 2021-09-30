<script setup lang="ts">
import Game from "./components/game.vue";
import RivalGame from "./components/rival-game.vue";
import { createGame, GameMode, PropType, deBuffProps } from "./game";
import config from "./common/config";
import { MySelf, PlayerState, Rival } from "./common/player";
import { inject, ref, watch, Ref } from "vue";
import { information } from "./common/utils";

const game = createGame(Object.assign({ passive: false }, config));
const rivalGame = createGame(Object.assign({ passive: true }, config));

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
const { props: gameProps } = game;

// 连接断开后，修改对手状态
const connectState: any = inject("connectState");
watch(connectState, (value) => {
  if (!value) {
    rival.onlineState.value = false;
  }
});

const gameMode = ref(GameMode.single);
const onGameModeChange = (mode: GameMode) => {
  if (state.value === PlayerState.started) {
    return information("游戏运行中不可以切换模式");
  }
  gameMode.value = mode;
};

const releaseProp = (propType: PropType, index: number) => {
  player.releaseProp(propType, index);
  if (deBuffProps.indexOf(propType) > -1) {
    rival.releaseProp(propType);
  }
};
</script>

<template>
  <div class="game__wrap">
    <div class="game__rival-wrap">
      <RivalGame :game="rivalGame" :rival="rival">
        <template #head>
          <div class="game__icon-bar">
            <div
              class="iconfont icon-connect"
              :class="{
                'icon-true': connectState,
                'icon-false': !connectState,
              }"
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
          <div
            v-if="gameMode === GameMode.single"
            class="game__control-buttons"
          >
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
            <button
              v-if="state === PlayerState.started"
              @click="player.endGame"
            >
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
          <div class="game__props">
            <div
              class="game__prop"
              v-for="(prop, index) in gameProps"
              @click="releaseProp(prop, index)"
            >
              <div
                class="iconfont"
                :class="{
                  'icon-app icon-true': prop === PropType.FILL,
                  'icon-strip icon-true': prop === PropType.GET_STRIP,
                  'icon-time icon-true': prop === PropType.SPEED_DOWN,
                  'icon-time icon-false down': prop === PropType.SPEED_UP,
                  'icon-invite icon-false': prop === PropType.DISABLE_ROTATE,
                }"
              ></div>
            </div>
          </div>
        </template>
      </RivalGame>
    </div>
    <div class="game__self-wrap">
      <Game :game="game" :player="player" :rival="rival"></Game>
    </div>
  </div>
</template>

<style lang="scss">
.game__wrap {
  display: flex;
  height: 100%;
}
.game__rival-wrap {
  background: lightseagreen;
  flex: 1 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.game__self-wrap {
  background: lightcoral;
  flex: 1 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.game__icon-bar {
  display: flex;
  justify-content: center;
  .iconfont {
    font-size: 0.22rem;
  }
}
.game__mode {
  background: #fff;
  border-radius: 0.2rem;
  display: flex;
  cursor: pointer;
  > div {
    padding: 0.05rem;
    text-align: center;
    flex: 1 0 0;
  }
  > div:first-child {
    border-right: 1px solid #000;
    border-top-left-radius: 0.2rem;
    border-bottom-left-radius: 0.2rem;
  }
  > div:last-child {
    border-top-right-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
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
  margin-top: 0.15rem;
  button {
    padding: 0.05rem;
    width: 100%;
    border-radius: 0.2rem;
    border: 1px lightblue solid;
    background: #fff;
    outline: none;
  }
}

.game__props {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  flex-wrap: wrap;
  gap: 10px;

  .iconfont {
    font-size: 35px;
  }
  .down {
    transform: rotateZ(180deg);
  }
}
</style>
