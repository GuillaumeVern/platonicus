import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'


@Component({
  selector: 'app-game-scene',
  standalone: true,
  imports: [],
  templateUrl: './game-scene.component.html',
  styleUrl: './game-scene.component.scss',
})
export class GameSceneComponent implements OnInit {
  scene = new THREE.Scene();
  material = new THREE.MeshNormalMaterial();
  renderer!: THREE.WebGLRenderer;
  clock = new THREE.Clock();
  hedron: any;
  elapsedTime = 0;

  canvasSizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  camera = new THREE.PerspectiveCamera(
    75,
    this.canvasSizes.width / this.canvasSizes.height,
    0.001,
    1000
  );

  ngOnInit(): void {
    this.createThreeJsScene();
    // this.material.vertexColors = true;
    this.setRenderer();
    this.resizeListener();
    this.animate();
  }

  createThreeJsScene(): void {
    const canvas = document.getElementById('canvas');
    
    this.addActors();
    this.addCamera();


    if (!canvas) {
      console.log('On est face à un pb');
      return;
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
  }

  addActors(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(-1, 2, 4);
    dirLight.castShadow = true;

    this.hedron = new THREE.Mesh(
      new THREE.IcosahedronGeometry(10, 0),
      this.material
    );
    this.hedron.castShadow = true;
    this.hedron.receiveShadow = true;

    this.scene.add(dirLight, this.hedron);
    this.loadWorld()
  }

  addCamera(): void {
    this.camera.position.x = 0;
    this.camera.position.y = 30;
    this.camera.position.z = 30;
    this.camera.castShadow = true;
    this.camera.receiveShadow = true;
    this.camera.lookAt(this.hedron.position);

    this.scene.add(this.camera);
  }

  setRenderer(): void {
    this.renderer.setClearColor(0xe232222, 1);
    this.renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);
  }

  animate(): void {
    this.elapsedTime = this.clock.getElapsedTime();

    this.hedron.rotation.x = -this.elapsedTime;
    this.hedron.rotation.y = -this.elapsedTime;
    this.hedron.rotation.z = -this.elapsedTime;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.animate());
  }

  makeInstance(
    material: THREE.Material,
    geometry: any,
    color: any,
    pos: THREE.Vector3
  ) {
    material = new THREE.MeshPhongMaterial({ color });

    const instance = new THREE.Mesh(geometry, material);
    this.scene.add(instance);

    instance.position.set(pos.x, pos.y, pos.z);

    return instance;
  }

  resizeListener(): void {
    window.addEventListener('resize', () => {
      this.canvasSizes.width = window.innerWidth;
      this.canvasSizes.height = window.innerHeight;

      this.camera.aspect = this.canvasSizes.width / this.canvasSizes.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);
      this.renderer.render(this.scene, this.camera);
    });
  }

  // chargement et parametrage du monde
  loadWorld(): void {
    const loader = new STLLoader();
    loader.load(
      'assets/world/world.STL',
      (geometry) => {
        geometry.computeVertexNormals();
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        material.wireframe = false;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(-500, -50, 100);
        mesh.scale.set(10, 10, 10);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        this.scene.add(mesh);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
          console.log(error)
      }
    )

  }
}
