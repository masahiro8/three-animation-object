<template>
  <div>
    <Slider @onchangerange="onChangeRange" />
    <div id="three" />
  </div>
</template>
<script>
import * as THREE from "three";
import { SceneDots } from "./three/scene_dots";
import Slider from "./Slider.vue";

//半球の半径
const config = {
  center: new THREE.Vector3(0.0, 0.0, 0.0),
  Radius: 120, // 半径
  numPerRadius: 8, //半径のdot数
  numPerCircle: 18, // 弧のdotの数
  numPerArch: 18, // 円のdotの数
  sphareAngle: 360, // 円の角度 -> 360 正円
};

// ベクトル間の距離
// const DISTANCE = 0.5;
// const getDistance = (v1, v2) => {
//   var dx = v1.x - v2.x;
//   var dy = v1.y - v2.y;
//   var dz = v1.z - v2.z;
//   return Math.sqrt(dx * dx + dy * dy + dz * dz);
// };

// Y方向ベクトルを取得
const getVectorPosition = ({ radius, rotate, angle }) => {
  const r = (rotate * Math.PI) / 180;
  const a = ((angle - 180) * Math.PI) / 180;
  const y = -1 * radius * Math.cos(r) * Math.cos(a);
  const z = radius * Math.sin(r);
  const x = radius * Math.cos(r) * Math.sin(a);
  return new THREE.Vector3(x, y, z);
};

// 回転して描画
const getObjects = ({
  center,
  radius,
  numPerArch,
  numPerCircle,
  numPerRadius,
}) => {
  const rot = config.sphareAngle / numPerCircle;
  const angle = config.sphareAngle / numPerArch;
  const numRadius = numPerRadius;
  const _radius = radius / numRadius;
  const colorRate = 128 / numRadius;

  let dots = [];

  // 天球内部の深度
  let counter = 1;
  for (let r = 0; r < numRadius; r++) {
    // xz回転
    for (let v = 0; v < numPerCircle; v++) {
      // y回転
      for (let i = 0; i < numPerArch; i++) {
        const vecVert = getVectorPosition({
          radius: _radius * r,
          rotate: rot * v,
          angle: angle * i,
        });

        dots.push({
          id: counter,
          color: [255, r * colorRate, 128 - i * colorRate],
          radius: 0.5,
          segments: 32,
          position: new THREE.Vector3(
            vecVert.x + center.x,
            vecVert.y + center.y,
            vecVert.z + center.z
          ),
        });
      }
    }
  }

  return dots;
};

export default {
  name: "Dots",
  components: {
    Slider,
  },
  data: () => {
    return {
      scene: null,
      arrowModel: null,
      targetRotate: 0,
    };
  },
  mounted() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const s = SceneDots();
    s.init({ canvasId: "three", width, height });
    s.setOrbitCont();
    this.scene = s;
    this.setSphares();
  },
  methods: {
    onChangeRange(value) {
      this.scene.setTargetRotate(value * (360 / 100));
    },

    setSphares() {
      const s = this.scene;

      // ドット群の情報
      // const dots = getObjects({
      //   center: config.center,
      //   radius: config.Radius,
      //   numPerArch: config.numPerArch,
      //   numPerCircle: config.numPerCircle,
      //   numPerRadius: config.numPerRadius,
      // });

      // for (let i = 0; i < dots.length; i++) {
      //   const _dot = { ...dots[i] };
      //   s.addPoint(_dot);
      // }

      s.addDots({ size: 1000, length: 3000 });
    },
  },
};
</script>
<style scoped>
#three {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  border: 1px solid red;
}
</style>
