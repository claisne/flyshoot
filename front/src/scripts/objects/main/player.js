
import * as THREE from 'three';

import Plane from 'scripts/meshes/plane';

// const SERVER_INTERPOLATION_TICKS = 3;

class Player extends THREE.Object3D {
  constructor(id, position, quaternion) {
    super();

    this.update = this.update.bind(this);
    this.serverUpdate = this.serverUpdate.bind(this);

    this.serverId = id;
    this.position.copy(position);
    this.quaternion.copy(quaternion);

    this.plane = new Plane();
    this.plane.rotateY(-Math.PI / 2);
    this.add(this.plane);
  }

  update(dt) {
    this.updatePosition(dt);
    this.plane.update(dt);
  }

  updatePosition(dt) {
    this.position.add(this.getWorldDirection().multiplyScalar(1 * dt));
  }

  serverUpdate(inputId, position, quaternion) {
    this.position.copy(position);
    this.quaternion.copy(quaternion);
  }
}

export default Player;
