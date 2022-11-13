import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const rotationToRadian = (r) => {
  return (r / 180) * Math.PI;
};

export const SceneLines = () => {
  let scene;
  let camera;
  let hemiLight;
  let renderer;
  let orbitControls;

  let lines = [];

  // const setCameraPosition = (n) => {
  //   const radian = (n * 0.1 * Math.PI) / 180;
  //   const _x = 100 * Math.sin(radian);
  //   const _z = 100 * Math.cos(radian);
  //   camera.position.set(_x, 0, _z);
  //   camera.up.set(0, 0, 0);
  // };

  const init = ({ canvasId, width, height }) => {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      window.devicePixelRatio ? window.devicePixelRatio : 1
    );
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    document.getElementById(canvasId).appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(83, width / height, 0.1, 2000);
    camera.position.set(50, -130, -40);
    camera.lookAt(new THREE.Vector3(-40, 0, -50));

    hemiLight = new THREE.HemisphereLight(0xff0000, 0xffffff, 1);
    scene.add(hemiLight);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    axis.position.set(0, 0, 0);

    console.log("init");

    // レンダリング
    const nrender = () => {
      requestAnimationFrame(nrender);
      renderer.render(scene, camera);
    };
    nrender();
  };

  const setOrbitCont = () => {
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true; // 視点操作のイージングをONにする
    orbitControls.dampingFactor = 0.2; // 視点操作のイージングの値
    orbitControls.rotateSpeed = 0.3; // 視点変更の速さ
    orbitControls.noZoom = true; // ズーム禁止
    orbitControls.enableZoom = true;
    orbitControls.noPan = false; // パン操作禁止
    orbitControls.enablePan = false;
  };

  /**
   *
   * @param {*} lines [w:int,points[{x,y,z}]
   */
  const addLine = ({ w, point, dir, length, center, color }) => {
    const material = new THREE.LineBasicMaterial({
      color,
      linewidth: w
    });

    const nPoints = [
      new THREE.Vector3(point.x, point.y, point.z),
      new THREE.Vector3(point.x + length, point.y, point.z)
    ];
    const _points = nPoints.map((point) => {
      return new THREE.Vector3(point.x, point.y, point.z);
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(_points);
    // 中心設定
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(center.x, 0, 0));
    const line = new THREE.Line(geometry, material);

    lines.push(line);
    scene.add(line);

    // 回転
    line.rotation.set(0, rotationToRadian(dir), 0);
  };
  const clearLines = () => {
    lines.forEach((line) => {
      scene.remove(line);
      line.material.dispose();
      line.geometry.dispose();
    });
  };

  return {
    init,
    setOrbitCont,
    addLine,
    clearLines
  };
};
