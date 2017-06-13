
import * as THREE from 'three';

const red = 0xf25346;
const white = 0xffffff;

class Plane extends THREE.Object3D {
  constructor() {
    super();

    this.addCockpit();
    this.addEngine();
    this.addWings();
    this.addBody();
    this.addTail();
    this.addPropeller();

    // const sphereGeometry = new THREE.SphereGeometry(80, 32, 32);
    // const sphereMaterial = new THREE.MeshBasicMaterial({
      // color: red,
      // wireframe: true,
    // });

    // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // this.add(sphere);
    // this.scale.set(new THREE.Vector3(2, 2, 2));
  }

  update(dt) {
    this.propeller.rotation.x += (dt / 100) * Math.PI;
  }

  addBody() {
    const bodyGeometry = new THREE.CylinderGeometry(25, 30, 60, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: red,
      shading: THREE.FlatShading,
    });

    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;

    this.add(body);
  }

  addTail() {
    const tailGeometry = new THREE.CylinderGeometry(5, 25, 30, 8);
    const tailMaterial = new THREE.MeshPhongMaterial({
      color: red,
      shading: THREE.FlatShading,
    });

    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.rotation.z = Math.PI / 2;
    tail.position.x = -45;

    this.add(tail);

    const flapGeometry = new THREE.BoxGeometry(30, 30, 2);
    flapGeometry.vertices[0].y = 10;
    flapGeometry.vertices[1].y = 10;
    flapGeometry.vertices[0].z = 0;
    flapGeometry.vertices[1].z = 0;
    flapGeometry.vertices[4].y = 20;
    flapGeometry.vertices[5].y = 20;
    const flapMaterial = new THREE.MeshPhongMaterial({
      color: red,
      shading: THREE.FlatShading,
    });

    const flap = new THREE.Mesh(flapGeometry, flapMaterial);
    flap.position.set(-45, 15, 0);

    this.add(flap);
  }

  addCockpit() {
    const cockpitGeometry = new THREE.SphereGeometry(18, 8);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
      color: white,
      shading: THREE.FlatShading,
    });

    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.x = 5;
    cockpit.position.y = 18;

    this.add(cockpit);
  }

  addEngine() {
    const engineGeometry = new THREE.CylinderGeometry(30, 20, 20, 8);
    const engineMaterial = new THREE.MeshPhongMaterial({
      color: white,
      shading: THREE.FlatShading,
    });

    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    engine.rotation.z = Math.PI / 2;
    engine.position.x = 40;

    this.add(engine);
  }

  addWings() {
    const wingGeometry = new THREE.BoxGeometry(40, 2, 150);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: red,
      shading: THREE.FlatShading,
    });

    const topWing = new THREE.Mesh(wingGeometry, wingMaterial);
    topWing.position.y = 15;
    this.add(topWing);

    const bottomWing = new THREE.Mesh(wingGeometry, wingMaterial);
    bottomWing.position.y = -15;
    this.add(bottomWing);

    const joinGeometry = new THREE.BoxGeometry(2, 30, 2);

    let join = new THREE.Mesh(joinGeometry, wingMaterial);
    join.position.z = 60;
    join.position.x = -10;
    this.add(join);

    join = new THREE.Mesh(joinGeometry, wingMaterial);
    join.position.z = 60;
    join.position.x = 10;
    this.add(join);

    join = new THREE.Mesh(joinGeometry, wingMaterial);
    join.position.z = -60;
    join.position.x = 10;
    this.add(join);

    join = new THREE.Mesh(joinGeometry, wingMaterial);
    join.position.z = -60;
    join.position.x = -10;
    this.add(join);
  }

  addPropeller() {
    const bladeGeometry = new THREE.BoxGeometry(1, 100, 5);
    const bladeMaterial = new THREE.MeshPhongMaterial({
      color: red,
      shading: THREE.FlatShading,
    });

    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.x = 2;

    const propellerGeometry = new THREE.BoxGeometry(10, 10, 10);
    const propellerMaterial = new THREE.MeshPhongMaterial({
      color: red,
      shading: THREE.FlatShading,
    });

    const propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
    propeller.add(blade);
    propeller.position.x = 50;

    this.add(propeller);
    this.propeller = propeller;
  }
}

export default Plane;
