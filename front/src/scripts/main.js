
import * as THREE from 'three';

import MainView from 'scripts/views/Main';

import * as Lights from 'scripts/lights/main';

import Ground from 'scripts/meshes/ground';
import Dome from 'scripts/meshes/dome';

import Player from 'scripts/objects/main/player';
import Hero from 'scripts/objects/main/hero';
import * as Commands from 'scripts/commands';

class Main extends MainView {
  constructor() {
    super();

    this.scene.add(Lights.ambient);
    this.scene.add(Lights.hemisphere);
    this.scene.add(Lights.directional);

    this.ground = new Ground();
    this.scene.add(this.ground);

    this.dome = new Dome();
    this.scene.add(this.dome);

    this.players = {};
  }

  handleCommand(command) {
    if (command.type === Commands.SET_PLAYER_ID) {
      this.heroId = command.playerId;
    }

    if (command.type === Commands.SET_PLAYERS) {
      for (let i = 0; i < command.players.length; i += 1) {
        const player = command.players[i];
        const id = player.id;
        const inputId = player.inputId;
        const pos = player.position;
        const qua = player.quaternion;

        const position = new THREE.Vector3(pos.x, pos.y, pos.z);
        const quaternion = new THREE.Quaternion(qua.x, qua.y, qua.z, qua.w);

        if (this.heroId === id) {
          if (this.hero == null) {
            this.hero = new Hero(id, position, quaternion);
            this.hero.onInputChange(this.sendInputUpdate.bind(this));

            this.scene.add(this.hero);
          } else {
            this.hero.serverUpdate(inputId, position, quaternion);
          }
        } else if (this.players[id] != null) {
          this.players[id].serverUpdate(inputId, position, quaternion);
        } else {
          const newPlayer = new Player(id, position, quaternion);
          this.players[player.id] = newPlayer;
          this.scene.add(newPlayer);
        }
      }
    }
  }

  sendInputUpdate(input) {
    this.socket.sendInput(input);
  }

  setSocket(socket) {
    this.socket = socket;
  }

  update(dt) {
    Object.keys(this.players).forEach((id) => {
      const player = this.players[id];
      player.update(dt);
    });

    if (this.hero != null) {
      this.hero.update(dt);
      this.hero.updateCamera(this.camera);
    }
  }

  updateHud(size) {
  }
}

export default Main;
