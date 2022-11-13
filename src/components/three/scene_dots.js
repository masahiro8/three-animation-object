import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 半球
// https://threejs.org/docs/#api/en/geometries/SphereGeometry

const rotationToRadian = (r) => {
  return (r / 180) * Math.PI;
};

export const SceneDots = () => {
  let scene;
  let camera;
  let hemiLight;
  let renderer;
  let orbitControls;
  let arrowModel;
  let arrows = [];
  let arrowTarget = null;
  let targetSliderValue = 0;
  let prefTargetSliderValue = 0;

  const init = ({ canvasId, width, height }) => {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.setClearColor(new THREE.Color(0x666666));
    document.getElementById(canvasId).appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(83, width / height, 0.1, 1000);
    camera.position.set(50, 50, 100);
    camera.up.set(0, 0, 1);
    camera.lookAt({ x: 0, y: 0, z: 0 });

    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(hemiLight);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);

    const axis = new THREE.AxesHelper(200);
    scene.add(axis);
    axis.position.set(0, 0, 0);

    console.log("init");

    // レンダリング
    const nrender = () => {
      requestAnimationFrame(nrender);
      renderer.render(scene, camera);

      // 前回とターゲットの座標に変更があれば更新
      if (arrowTarget && targetSliderValue !== prefTargetSliderValue)
        setArrowsLookat();
    };
    nrender();
  };

  // 色
  const rgb2hex = (rgb) => {
    return (
      "#" +
      rgb
        .map(function (value) {
          return ("0" + value.toString(16)).slice(-2);
        })
        .join("")
    );
  };

  // 矢印の向く方向
  const addArrowTarget = ({ position }) => {
    const mesh = new THREE.Mesh(
      // new THREE.CylinderGeometry(10, 10, 1, 32),
      new THREE.SphereGeometry(2, 12, 12),
      new THREE.MeshBasicMaterial({
        color: 0xff0000
      })
    );

    arrowTarget = new THREE.Object3D();
    arrowTarget.add(mesh);
    arrowTarget.visible = true;
    arrowTarget.position.set(position.x, position.y, position.z);
    scene.add(arrowTarget);
  };

  const addPoint = ({
    radius,
    segments,
    position,
    color = [255, 255, 255]
  }) => {
    const mesh = new THREE.Mesh(
      // new THREE.CylinderGeometry(10, 10, 1, 32),
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshBasicMaterial({
        color: rgb2hex(color)
      })
    );

    let obj = new THREE.Object3D();
    obj.add(mesh);
    obj.visible = true;
    obj.position.set(position.x, position.y, position.z);
    scene.add(obj);
    camera.lookAt(position);
  };

  const addDots = ({ size = 1000, length = 1000 }) => {
    const vertices = [];
    for (let i = 0; i < length; i++) {
      const x = size * (Math.random() - 0.5);
      const y = size * (Math.random() - 0.5);
      const z = size * (Math.random() - 0.5);

      vertices.push(x, y, z);
    }

    // 形状データを作成
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    // マテリアルを作成
    const material = new THREE.PointsMaterial({
      size: 5,
      color: rgb2hex([255, 0, 0])
    });

    // 物体を作成
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
  };

  const loadGLTF = (url) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(url, function (data) {
      const gltf = data;
      const object = gltf.scene;
      arrowModel = object;
    });
  };

  const addGLTF = ({
    position = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 },
    scale = { x: 0.5, y: 0.5, z: 0.5 }
  }) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("/data/arrow.glb", function (data) {
      const gltf = data;
      const object = gltf.scene;
      object.position.set(position.x, position.y, position.z);
      object.rotation.set(
        rotationToRadian(rotation.x),
        rotationToRadian(rotation.y),
        rotationToRadian(rotation.z)
      );
      object.scale.set(scale.x, scale.y, scale.z);
      arrows.push(object);
      scene.add(object);
    });
  };

  //半球追加
  const addHalfSphare = ({ center, radius = 30 }) => {
    /*
    SphereGeometry(
      radius : Float,
      widthSegments : Integer,
      heightSegments : Integer,
      phiStart : Float,
      phiLength : Float,
      thetaStart : Float,
      thetaLength : Float
    )
    */
    const geometry = new THREE.SphereGeometry(radius, 32, 16, 0, 3, 0, 3.11);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff8800,
      // wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    let obj = new THREE.Object3D();
    obj.add(mesh);
    obj.visible = true;
    obj.position.set(center.x, center.y, center.z);
    scene.add(obj);
  };

  // 矢印の方向を設定
  const setArrowsLookat = (vec) => {
    //ターゲット座標を更新
    const rx = 100 * Math.cos(targetSliderValue * (Math.PI / 180));
    const ry = 100 * Math.sin(targetSliderValue * (Math.PI / 180));
    const _vec = new THREE.Vector3(rx, ry, 0);
    arrowTarget.position.set(_vec.x, _vec.y, _vec.z);

    // 高さで方向のばらつきを入れる
    const zRate = 10 / arrows.length;

    for (let i = 0; i < arrows.length; i++) {
      const xRand = Math.random() * 30 - 15;
      const yRand = Math.random() * 30 - 15;
      const zRand = Math.random() * 30 - 15;
      const rx = 100 * Math.cos(targetSliderValue + xRand * (Math.PI / 180));
      const ry = 100 * Math.sin(targetSliderValue + yRand * (Math.PI / 180));
      const lookatVec = new THREE.Vector3(rx, ry, zRand - 15 + i * zRate);
      arrows[i].lookAt(lookatVec);
    }

    //最後に設定した値を保持
    prefTargetSliderValue = targetSliderValue;
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

  const setTargetRotate = (rot) => {
    targetSliderValue = rot;
  };

  return {
    init,
    addPoint,
    addDots,
    addGLTF,
    setOrbitCont,
    setArrowsLookat,
    addArrowTarget,
    setTargetRotate,
    addHalfSphare
  };
};
