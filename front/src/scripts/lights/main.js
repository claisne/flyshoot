
import * as THREE from 'three';

export const ambient = new THREE.AmbientLight(0x221100, 0.1);

export const hemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);

export const directional = new THREE.DirectionalLight(0xffffff, 0.7);
directional.color.setHSL(0.1, 1, 0.95);
directional.castShadow = true;
