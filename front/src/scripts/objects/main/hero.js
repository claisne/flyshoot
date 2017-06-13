
import * as THREE from 'three';

import Player from 'scripts/objects/main/player';

class Hero extends Player {
  constructor(id, position, quaternion) {
    super(id, position, quaternion);

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    this.roll = {
      left: false,
      right: false,
    };

    this.pitch = {
      up: false,
      down: false,
    };

    this.camera = {
      rotationX: 0,
    };

    this.inputId = 0;
  }

  handleKeyDown(evt) {
    let inputChanged = false;

    switch (evt.keyCode) {
      case 83: // S
        inputChanged = inputChanged || !this.pitch.up;
        this.pitch.up = true;
        break;
      // case 87: // Z
      case 90: // Z
        inputChanged = inputChanged || !this.pitch.down;
        this.pitch.down = true;
        break;
      // case 65: // Q
      case 81: // Q
        inputChanged = inputChanged || !this.roll.left;
        this.roll.left = true;
        break;
      case 68: // D
        inputChanged = inputChanged || !this.roll.right;
        this.roll.right = true;
        break;
      default:
        break;
    }

    if (inputChanged === true) {
      this.onInputChangeCb(this.getInput());
    }
  }

  handleKeyUp(evt) {
    let inputChanged = false;

    switch (evt.keyCode) {
      case 83: // S
        inputChanged = inputChanged || this.pitch.up;
        this.pitch.up = false;
        break;
      // case 87: // Z
      case 90: // Z
        inputChanged = inputChanged || this.pitch.down;
        this.pitch.down = false;
        break;
      // case 65: // Q
      case 81: // Q
        inputChanged = inputChanged || this.roll.left;
        this.roll.left = false;
        break;
      case 68: // D
        inputChanged = inputChanged || this.roll.right;
        this.roll.right = false;
        break;
      default:
        break;
    }

    if (inputChanged === true) {
      this.onInputChangeCb(this.getInput());
    }
  }

  getRoll() {
    if (this.roll.left === this.roll.right) { return 0; }
    if (this.roll.left === true) { return -1; }
    if (this.roll.right === true) { return 1; }
    return 0;
  }

  getPitch() {
    if (this.pitch.up === this.pitch.down) { return 0; }
    if (this.pitch.up === true) { return -1; }
    if (this.pitch.down === true) { return 1; }
    return 0;
  }

  serverUpdate(inputId, position, quaternion) {
    // console.log(inputId, this.inputId);
    // console.log(this.position.distanceTo(position));
    // console.log(qDistanceTo(this.quaternion, quaternion));
    this.position.copy(position);
    this.serverQuaternion = quaternion;
  }

  update(dt) {
    super.update(dt);
    this.updateRotation(dt);
    this.updateCameraRotation();
  }

  updateRotation(dt) {
    this.quaternion.slerp(this.serverQuaternion, 0.1);
    this.rotateX(this.getPitch() * 0.0004 * dt);
    this.rotateZ(this.getRoll() * 0.001 * dt);
  }

  updateCameraRotation() {
    const camera = this.camera;

    if (this.getPitch() !== 0) {
      camera.rotationX -= this.getPitch() * 0.005;
      if (camera.rotationX > Math.PI / 20) {
        camera.rotationX = +Math.PI / 20;
      }

      if (camera.rotationX < -Math.PI / 20) {
        camera.rotationX = -Math.PI / 20;
      }
    } else if (camera.rotationX > 0) {
      camera.rotationX -= 0.002;
      if (camera.rotationX < 0) { camera.rotationX = 0; }
    } else if (camera.rotationX < 0) {
      camera.rotationX += 0.002;
      if (camera.rotationX > 0) { camera.rotationX = 0; }
    }
  }

  getCameraPosition() {
    return this.position.clone()
      .add(this.getWorldDirection().multiplyScalar(-500))
      .add((new THREE.Vector3(0, 150, 0)).applyEuler(this.rotation));
  }

  updateCamera(camera) {
    camera.position.copy(this.getCameraPosition());
    camera.rotation.copy(this.rotation.clone());

    camera.rotateY(Math.PI);
    camera.rotateX(this.camera.rotationX);
  }

  onInputChange(cb) {
    this.onInputChangeCb = cb;
  }

  getInput() {
    this.inputId += 1;
    this.inputId %= 256;

    const input = {
      id: this.inputId,
      roll: this.roll,
      pitch: this.pitch,
    };

    return input;
  }

  distanceToDirection(player) {
    const direction = this.getWorldDirection();
    const heroToPlayer = player.position.clone().sub(this.position);
    const playerToHero = this.position.clone().sub(player.position);

    const t = heroToPlayer.dot(direction);
    const b = playerToHero.clone().add(direction.clone().multiplyScalar(t));

    return { t, b };
  }
}

export default Hero;

