import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AnimateMorphService } from '../../../services/animate-morph.service';

@Component({
  selector: 'app-game-scene',
  standalone: true,
  imports: [],
  templateUrl: './game-scene.component.html',
  styleUrl: './game-scene.component.scss',
})
export class GameSceneComponent implements OnInit {
  scene = new THREE.Scene();
  material = new THREE.MeshMatcapMaterial();
  renderer!: THREE.WebGLRenderer;
  clock = new THREE.Clock();
  hedrons: any[] = [];
  elapsedTime: number = 0;
  morphic: any[] = [];

  //Character variables
  charHedron: any;
  charLevel: number = 0;
  speedVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  canvasSizes = {
    width: window.innerWidth,
    height: window.innerHeight * 0.9,
  };

  camera = new THREE.PerspectiveCamera(
    75,
    this.canvasSizes.width / this.canvasSizes.height,
    0.001,
    1000
  );

  constructor(private animateMorphService: AnimateMorphService) { }

  ngOnInit(): void {
    this.createThreeJsScene();
    // this.material.vertexColors = true;
    this.renderer.setClearColor(0xe232222, 1);
    this.renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);
    this.loadMorphs();
    this.resizeListener();
    this.animate();

    // controle de la camera
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
  }



  /**
   * Create the base scene using the canvas, adding actors and camera
   */
  createThreeJsScene(): void {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');

    window.addEventListener('keydown', (event) => {
      this.actKeydown(event);
    });
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

  /** Add actors to the scene, meaning light and models */
  addActors(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(-1, 2, 4);
    dirLight.castShadow = true;

    this.charHedron = new THREE.Mesh(
      new THREE.TetrahedronGeometry(10, 0),
      this.material
    );
    this.charHedron.rotation.set(-Math.PI / 4 - 0.2, -Math.PI / 4, 0);
    this.scene.add(this.charHedron);
    this.loadWorld();
    this.hedrons.forEach((hedron) => {
      hedron.castShadow = true;
      hedron.receiveShadow = true;
      this.scene.add(hedron);
    });
    this.scene.add(ambientLight, dirLight);
  }

  /** Add Camera to the scene */
  addCamera(): void {
    this.camera.position.x = 0;
    this.camera.position.y = 60;
    this.camera.position.z = 50;
    this.camera.castShadow = true;
    this.camera.receiveShadow = true;
    this.camera.lookAt(this.charHedron.position);

    this.scene.add(this.camera);
  }

  /** Use clock to animate movements in scene each frame */
  animate(): void {
    this.elapsedTime = this.clock.getElapsedTime();
    this.hedrons.forEach((hedron) => {
      hedron.rotation.x = -this.elapsedTime;
      hedron.rotation.y = -this.elapsedTime;
      hedron.rotation.z = -this.elapsedTime;
    });

    // this.charHedron.rotation.x += -this.elapsedTime * this.speedVector.x;
    // this.charHedron.rotation.y += this.elapsedTime * this.speedVector.y;
    // this.charHedron.rotation.z += this.elapsedTime * this.speedVector.z;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.animate());
  }

  /** Bind key events to actions */
  actKeydown(event: { key: string }) {
    if (event.key == 'w') {
      this.speedVector.x += 1;

    }
    if (event.key == 'l') {
      console.log("charLevel = " + this.charLevel)

    }
    if (event.key == 'u') {
      this.evolveGeometry(1);
    }
    if (event.key == 'p') {
      this.playMorph();
    }
    if (event.key == 'm') {
      if (this.morphic[0].morphTargetInfluences[0] > 0)
        this.morphic[0].morphTargetInfluences[0] -= 0.03;
      if (this.morphic[1].morphTargetInfluences[0] > 0) {
        this.morphic[1].morphTargetInfluences[0] -= 0.03;
        this.morphic[1].morphTargetInfluences[1] += 0.03;
      } else {
        this.morphic[1].morphTargetInfluences[0] = 0;
        this.morphic[1].morphTargetInfluences[1] = 1;
      }
    }
  }

  evolveGeometry(phase: number) {
    if (phase == 1) {
      console.log("phase 1");
      this.removeGeometry(this.charHedron);
      this.morphic[this.charLevel].position.set(
        this.charHedron.position.x,
        this.charHedron.position.y,
        this.charHedron.position.z);
      this.scene.add(this.morphic[this.charLevel]);
      this.playMorph();
    }

    if (phase == 2) {
      console.log("phase 2");
      const geometryLine = [
        new THREE.TetrahedronGeometry(10),
        new THREE.BoxGeometry(15.5, 15.5, 15.5),
        new THREE.OctahedronGeometry(13),
        new THREE.DodecahedronGeometry(10),
        new THREE.IcosahedronGeometry(10),
      ];
      if (this.charLevel < 4) { this.charLevel++; }
      this.charHedron = new THREE.Mesh(
        geometryLine[this.charLevel],
        this.material
      );
      this.scene.add(this.charHedron);
    }
  }

  removeGeometry(geometry: any) {
    geometry.geometry.dispose();
    geometry.material.dispose();
    this.scene.remove(geometry);
  }

  /**
   * Return a Three js instance created from parameters and adds it to scene
   * @param pos Position, in Vector3 form
   * @returns instance
   */
  makeInstance(material: THREE.Material, geometry: any, pos: THREE.Vector3) {
    const instance = new THREE.Mesh(geometry, material);
    instance.position.set(pos.x, pos.y, pos.z);
    this.scene.add(instance);
    return instance;
  }

  /** Resizes canvas based on window size */
  resizeListener(): void {
    window.addEventListener('resize', () => {
      this.canvasSizes.width = window.innerWidth;
      this.canvasSizes.height = window.innerHeight * 0.9;

      this.camera.aspect = this.canvasSizes.width / this.canvasSizes.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);
      this.renderer.render(this.scene, this.camera);
    });
  }

  /** chargement et parametrage du monde */
  loadWorld(): void {
    const loader = new STLLoader();
    loader.load(
      'assets/world/world.STL',
      (geometry) => {
        geometry.computeVertexNormals();
        const material = new THREE.MeshLambertMaterial({ color: 0xaa00ff });
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
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /** Loading morph shapes */
  loadMorphs() {
    let loader = new GLTFLoader();

    loader.load('assets/shapes/tetratocube.glb', (gltf) => {
      this.morphic[0] = gltf.scenes[0].children[0];
      this.morphic[0].material = new THREE.MeshMatcapMaterial();
      this.morphic[0].scale.set(8, 8, 8);
      this.morphic[0].morphTargetInfluences[0] = 1;
    });

    loader.load('assets/shapes/octacube.glb', (gltf) => {
      this.morphic[1] = gltf.scenes[0].children[0];
      this.morphic[1].material = new THREE.MeshMatcapMaterial();
      this.morphic[1].scale.set(11, 11, 11);
      this.morphic[1].morphTargetInfluences[0] = 1;
    });
  }

  playMorph() {
    let morphProgress = 0;
    let intervalId = setInterval(() => {
      morphProgress = THREE.MathUtils.damp(morphProgress, 1, 4, this.clock.getDelta());
      if (morphProgress >= 0.98) {
        this.removeGeometry(this.morphic[this.charLevel]);
        this.evolveGeometry(2);
        morphProgress = 0
        // Stop the interval when morph is complete
        clearInterval(intervalId);
      }

      // Apply morphProgress
      this.morphic[this.charLevel].morphTargetInfluences[0] = 1 - morphProgress;
      if (this.charLevel == 1) {
        this.morphic[this.charLevel].morphTargetInfluences[1] = morphProgress;
      }
    }, 10); // Run every 100 milliseconds
  }
}
