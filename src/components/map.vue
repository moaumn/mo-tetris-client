<script lang="ts" setup>
defineProps({
  map: {
    type: Array,
    required: true,
  },
  size: {
    type: Number,
    default: 20,
  },
});
</script>

<template>
  <div class="map">
    <div class="map__row" v-for="row in map">
      <div
        class="map__col"
        v-for="num in row"
        :style="{
          backgroundColor: num === 0 ? 'lightblue' : 'orange',
          width: size + 'px',
          height: size + 'px',
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
