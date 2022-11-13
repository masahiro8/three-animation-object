<template>
  <div class="sliderFrame">
    <input
      class="slider"
      type="range"
      v-model="rotateRange"
      @change="onChangeRange"
    />
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      rotateRange: 0,
    };
  },
  methods: {
    onChangeRange() {
      this.$emit("onchangerange", this.rotateRange);
    },
  },
};
</script>
<style scoped>
.sliderFrame {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 32px;
  z-index: 1;
  background-color: white;
}
</style>