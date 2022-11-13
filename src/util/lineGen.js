import * as THREE from "three";

/**
 *
 * @param {*} param0
 *  {
 *   point: {x,y,z},
 *   dir : int (角度)
 *   length: 距離
 *  }
 */
export const lineGen = ({ point, dir, length }) => {
  const rx = length * Math.cos(dir * (Math.PI / 180)) + point.x;
  const rz = length * Math.sin(dir * (Math.PI / 180)) + point.z;
  return [
    new THREE.Vector3(point.x, point.y, point.z),
    new THREE.Vector3(rx, 0, rz)
  ];
};
