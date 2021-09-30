<script lang="ts" setup>
import { MapState } from "../game";

withDefaults(
  defineProps<{
    map: number[][];
    size?: number;
  }>(),
  {
    size: 0.18,
  }
);

const getColor = (mapState: MapState) => {
  switch (mapState) {
    case MapState.EMPTY:
      return "rgba(173,216,230,.2)";
    case MapState.NORMAL_BOX:
      return "orange";
    case MapState.DISABLE_ROTATE_BOX:
      return "grey";
    case MapState.FILLED:
      return "green";
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
          backgroundColor: getColor(state),
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
