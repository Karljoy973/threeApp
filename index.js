import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);
    this.camera = new THREE.PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 20);

    this.scene = new THREE.Scene();
    const ambiant = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 70);
    const directional = new THREE.SpotLight(0xffffff, 1, 100);
    directional.position.set(0, 10, 30);
    directional.rotation.set(Math.PI / 4, 0, 0, "XYZ");
    this.scene.add(ambiant, directional);

    this.scene.background = new THREE.Color(0xc7c7c3);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.render.bind(this));

    container.appendChild(this.renderer.domElement);

    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshPhongMaterial({
      color: 0x258f1f,
      specular: 0xffffff,
      shininess: 100,
    });
    this.mesh = new THREE.Mesh(geometry, material);

    this.loadGLTF();

    this.scene.add(this.mesh);
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener("resize", this.resize.bind(this));
  }
  loadGLTF() {
    const self = this;
    const loader = new GLTFLoader().setPath("./assets/right.glb");
    loader.load(
      "right.glb",
      function (gltf) {
        self.right = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        self.scene.add(gltf.scene);
        self.renderer.setAnimationLoop(self.render.bind(self));
      },
      function (err) {
        console.error("sth went wrong");
      }
    );
  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  render() {
    this.mesh.rotateY(0.01);
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
