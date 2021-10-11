<script lang="ts" setup>
import { Game, MapState, Box } from "../game";
import ice from "../assets/ice.png";
import fire from "../assets/fire.png";
import { playEffect } from "../common/special-effect";
import { onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    map: number[][];
    game?: Game;
    rival?: boolean;
    size?: number;
  }>(),
  {
    size: 0.18,
    rival: false,
  }
);

const bg = props.rival ? ice : fire;
const getBackground = (mapState: MapState) => {
  switch (mapState) {
    case MapState.EMPTY:
      return "rgba(173,216,230,.2)";
    case MapState.NORMAL_BOX:
      return `url(${bg}) center/100% `;
    case MapState.DISABLE_ROTATE_BOX:
      return "grey";
    case MapState.FILLED:
      return `url(${bg}) center/100%`;
  }
};

// 播放掉落特效
const mapElement = ref();
if (props.game) {
  // 获取box的尺寸
  let boxSize = 0;
  const getBoxSize = () =>
    (boxSize = mapElement.value.querySelector(".map__col").offsetWidth);
  onMounted(() => {
    getBoxSize();
    window.addEventListener("resize", getBoxSize);
  });
  onUnmounted(() => window.removeEventListener("resize", getBoxSize));

  props.game.on("fallDown", (box: Box) => {
    // 计算中心x坐标和最大y坐标
    const xs: number[] = [],
      ys: number[] = [];
    box.bottomPoints.forEach((point) => {
      xs.push(point.x);
      ys.push(point.y);
    });
    const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const bottomY = Math.max(...ys);
    playEffect(
      (box.x + centerX) * boxSize + mapElement.value.offsetLeft - 40,
      (box.y + bottomY) * boxSize + mapElement.value.offsetTop - 30,
      100,
      100,
      props.rival
    );
  });
}
</script>

<template>
  <div ref="mapElement" class="map">
    <div class="map__row" v-for="row in props.map">
      <div
        class="map__col"
        v-for="state in row"
        :style="{
          background: getBackground(state),
          width: props.size + 'rem',
          height: props.size + 'rem',
        }"
      ></div>
    </div>
  </div>
</template>

<style>
.map__row {
  display: flex;
}
.map__col {
  background-color: lightblue;
  margin: 0.5px;
}
</style>
