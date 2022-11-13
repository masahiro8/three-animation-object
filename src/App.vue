<template>
  <div id="app">
    <Lines id="lines" :scroll="sc" />
    <Dots id="dots" :scroll="sc" />
  </div>
</template>

<script>
import Dots from "./components/Dots";
import Lines from "./components/Lines";
import { ScrollCallback } from "./util/ScrollCallback";

export default {
  name: "App",
  components: {
    Dots,
    Lines,
  },
  data: () => {
    return {
      sc: 0,
    };
  },
  mounted() {
    ScrollCallback((s) => {
      this.sc = s;
    });
  },
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  position: relative;
}

#dots {
  position: relative;
  height: 100vh;
  width: 100%;
}

#lines {
  position: relative;
  height: 100vh;
  width: 100%;
}
</style>
