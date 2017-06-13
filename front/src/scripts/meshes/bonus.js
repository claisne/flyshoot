
import * as THREE from 'three';

class Bonus extends THREE.Mesh {
  constructor(x, y, z) {
    const geometry = new THREE.OctahedronGeometry(25, 0);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff2b,
      shading: THREE.FlatShading,
      shininess: 50,
      transparent: true,
      opacity: 0.8,
      specular: 0x00ff2b,
      emissive: 0xffffff,
      emissiveIntensity: 0.3,
    });

    super(geometry, material);
    this.scale.set(10, 10, 10);
    this.position.set(x, y, z);
  }

  update(dt) {
    this.rotation.x += (dt / 500) * Math.PI;
  }
}

export default Bonus;
