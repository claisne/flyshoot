
import * as THREE from 'three';

class Ground extends THREE.Mesh {
  constructor() {
    const size = 100 * 1000;

    const geometry = new THREE.PlaneGeometry(size, size, 100, 100);

    const material = new THREE.MeshPhongMaterial({
      wireframe: true,
    });

    super(geometry, material);

    this.rotation.x = -Math.PI / 2;
  }
}

export default Ground;

