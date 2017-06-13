
import * as THREE from 'three';

const glslify = require('glslify');

const vertexShader = glslify('./../shaders/dome.vert');
const fragmentShader = glslify('./../shaders/dome.frag');

class Dome extends THREE.Mesh {
  constructor() {
    const uniforms = {
      topColor: { value: new THREE.Color(0x409fff) },
      bottomColor: { value: new THREE.Color(0xe7f3ff) },
      offset: { value: 40 },
      exponent: { value: 0.95 },
    };

    const geometry = new THREE.SphereGeometry(100 * 1000, 32, 15);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.BackSide,
    });

    super(geometry, material);
  }
}

export default Dome;
