<script lang="ts" setup>
import { MapState } from "../game";
import ice from "../assets/ice.png";
import fire from "../assets/fire.png";

const props = withDefaults(
  defineProps<{
    map: number[][];
    ice?: boolean;
    size?: number;
  }>(),
  {
    size: 0.18,
    ice: true,
  }
);

const bg = props.ice ? ice : fire;
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
</script>

<template>
  <div class="map">
    <div class="map__row" v-for="row in map">
      <div
        class="map__col"
        v-for="state in row"
        :style="{
          background: getBackground(state),
          width: size + 'rem',
          height: size + 'rem',
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
