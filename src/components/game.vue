<script setup lang="ts">
import Map from "./map.vue";
import { Game, GameMode, initMap } from "../game";
import { computed, inject, reactive, watch } from "vue";
import { render } from "../game/renderer";
import { Player, PlayerState } from "../common/player";

const props = defineProps<{
  game: Game;
  player: Player;
  rival: Player;
}>();

const { state } = props.player;

const { nextBox, score, map } = props.game;

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
</script>

<template>
  <div class="game">
    <Map :map="map" :game="props.game"> </Map>
    <div class="game__side">
      <div class="game__next-box">
        <Map :map="nextMap" :size="0.1"></Map>
      </div>
      <div class="game__score">分数：{{ score }}</div>
      <div v-if="state === PlayerState.started" class="game__buttons">
        <div>
          <div
            class="iconfont icon-up game__button"
            @click="props.player.handleRotate"
          ></div>
        </div>
        <div>
          <div
            class="iconfont icon-left game__button"
            @click="props.player.handleMoveLeft"
          ></div>
          <div
            class="iconfont icon-right game__button"
            @click="props.player.handleMoveRight"
          ></div>
        </div>
        <div>
          <div
            class="iconfont icon-down game__button"
            @click="props.player.handleMoveDown"
          ></div>
        </div>
        <div
          class="iconfont icon-next game__button"
          @click="props.player.handleFallDown"
        ></div>
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
  margin-bottom: 0.15rem;
}
.game__side {
  width: 1.2rem;
  display: flex;
  flex-direction: column;
  padding-left: 0.1rem;
  color: #fff;
}
.game__buttons {
  justify-self: flex-end;
  display: flex;
  align-items: center;
  flex-direction: column;

  > div {
    display: flex;
    justify-content: space-between;
  }
  .icon-next {
    transform: rotateZ(90deg);
  }
}
.game__button {
  font-size: 0.55rem;
}
.game__next-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.15rem;
}
</style>
