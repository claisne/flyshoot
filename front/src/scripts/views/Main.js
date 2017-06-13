
import * as THREE from 'three';
import * as TWO from 'scripts/two';

class AbstractApplication {
  constructor() {
    this.oldTimestamp = 0;

    this.camera =
        new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 500 * 1000);
    this.camera.position.add(new THREE.Vector3(0, 500, 1000));
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.renderer2D = new TWO.Renderer();
    this.renderer2D.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer2D.domElement);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  getDeltaTime(timestamp) {
    const dt = timestamp - this.oldTimestamp;
    this.oldTimestamp = timestamp;
    return dt;
  }

  animate(timestamp = 0) {
    requestAnimationFrame(this.animate.bind(this));
    this.update(this.getDeltaTime(timestamp));
    this.renderer.render(this.scene, this.camera);
    this.renderer2D.render();
    this.updateHud(this.renderer.getSize());
  }
}

export default AbstractApplication;
