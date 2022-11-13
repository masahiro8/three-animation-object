<template>
  <div>
    <div id="three_lines" />
  </div>
</template>
<script>
import * as THREE from "three";
import { SceneLines } from "./three/scene_lines";
// import { lineGen } from "../util/lineGen";

const GenLines = (scene) => {
  let max = 10;
  const lines = [];

  // データ生成
  const genLineRand = (n) => {
    const y = -Math.random() * 60 - 30;
    const z = Math.random() * 60 - 30;
    const dir = Math.random() * 4;
    const length = Math.random() * 300 + 300; // LINEの長さ
    const radius = Math.random() * 5; //アニメーションの回転半径
    const center = {
      x: (length / (Math.random() * 10)) * -1,
      y: 0,
      z: 0,
    };
    const animSpeed = Math.random() * 0.1; //アニメーションの速度
    return {
      color: Math.floor(Math.random() * 2) ? 0xcccccc : 0xd8d8d8,
      point: { x: 0, y, z },
      dir: dir + n,
      length,
      radius,
      animSpeed,
      center,
    };
  };

  // 回転
  const updateLineRotation = (obj, n, diff) => {
    const dir = obj.dir + Math.random() * diff * obj.animSpeed;
    return {
      ...obj,
      dir,
    };
  };

  // LINEを生成
  const init = (mx) => {
    max = mx || 10;
    //初期化
    for (let i = 0; i < max; i++) {
      let _line = genLineRand((360 / max) * i);
      lines[i] = JSON.parse(JSON.stringify(_line));
    }

    //生成
    for (let i = 0; i < max; i++) {
      lines[i] = updateLineRotation(lines[i], 0, 0);
      scene.addLine({
        w: 100,
        ...lines[i],
      });
    }
  };

  //lineの変形
  const update = ({ scroll, diff }) => {
    for (let i = 0; i < max; i++) {
      //回転
      lines[i] = updateLineRotation(lines[i], scroll, diff);
      scene.addLine({
        w: 100,
        ...lines[i],
      });
    }
  };

  return {
    init,
    update,
  };
};

export default {
  name: "Lines",
  data: () => {
    return {
      scene: null,
      GenLines: null,
    };
  },
  props: {
    scroll: {
      type: Number,
    },
  },
  mounted() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const s = SceneLines();
    s.init({ canvasId: "three_lines", width, height });
    // s.setOrbitCont();
    this.scene = s;

    this.GenLines = GenLines(s);
    this.GenLines.init(200);

    // this.loopOnMsec({ timeMsec: 30000, loopMsec: 10 });

    let prevScroll = 0;
    let rotateValue = 0;

    this.$watch(
      () => this.scroll,
      (val) => {
        //　差分
        const diff = val - prevScroll;
        rotateValue += diff;
        this.scrollOnAnimation({ scroll: rotateValue, diff });
        this.scene.setCameraPosition(val);
        prevScroll = val;
      }
    );
  },
  methods: {
    addLines() {},
    scrollOnAnimation({ scroll, diff }) {
      const onPlay = () => {
        this.scene.clearLines();
        this.GenLines.update({ scroll, diff });
      };
      onPlay();
    },

    /**
     * {
     *  timeMsec: アニメーション時間,
     *   liipMsec: ループ切り替え時間
     * }
     */
    loopOnMsec({ timeMsec, loopMsec }) {
      let isPlaying = false;
      let startTime = new Date();
      const onPlay = () => {
        const endTime = new Date();
        const diffMsec = endTime.getTime() - startTime.getTime();
        if (isPlaying) {
          requestAnimationFrame(onPlay);
          if (diffMsec && diffMsec >= loopMsec) {
            startTime = new Date();
            this.scene.clearLines();
            this.GenLines.update();
          }
        }
      };
      isPlaying = true;
      onPlay();
      console.log("anim play");
      setTimeout(() => {
        console.log("anim stop");
        isPlaying = false;
      }, timeMsec);
    },
  },
};
</script>
<style lang="scss" scoped>
#three_lines {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  border: 1px solid red;
}
</style>