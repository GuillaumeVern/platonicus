import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

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

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-1, 2, 4);

    this.hedron = new THREE.Mesh(
      new THREE.IcosahedronGeometry(10, 0),
      this.material
    );

    this.scene.add(ambientLight, dirLight, this.hedron);
  }

  addCamera(): void {
    this.camera.position.z = 30;
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
}
