import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { threeToCannon, ShapeType } from 'three-to-cannon';
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
  hedrons: any[] = [];
  charHedron: any;
  icosahedronBody!: CANNON.Body;
  speedVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  elapsedTime: number = 0;
  physicsWorld!: CANNON.World;
  stats!: Stats;
  controls!: OrbitControls;
  delta: number = 0;

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

  ngOnInit(): void {
    this.physics();
    this.createThreeJsScene();
    // this.material.vertexColors = true;
    this.setRenderer();
    this.resizeListener();
    
    // controle de la camera
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    
    // statistiques
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    this.animate();
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
      new THREE.IcosahedronGeometry(10, 0),
      this.material
    );
    let icosahedronShape = threeToCannon(this.charHedron, { type: ShapeType.HULL });
    this.icosahedronBody = new CANNON.Body({ mass: 1 });
    if (icosahedronShape !== null) {
      this.icosahedronBody.addShape(icosahedronShape.shape);
    }
    this.icosahedronBody.position.x = this.charHedron.position.x;
    this.icosahedronBody.position.y = this.charHedron.position.y;
    this.icosahedronBody.position.z = this.charHedron.position.z;
    this.physicsWorld.addBody(this.icosahedronBody);

    this.loadWorld();
    this.hedrons.forEach((hedron) => {
      hedron.castShadow = true;
      hedron.receiveShadow = true;
      this.scene.add(hedron);
    });
    this.scene.add(ambientLight, dirLight, this.charHedron);
  }

  /** Add Camera to the scene */
  addCamera(): void {
    this.camera.position.x = 0;
    this.camera.position.y = 30;
    this.camera.position.z = 30;
    this.camera.castShadow = true;
    this.camera.receiveShadow = true;
    this.camera.lookAt(this.charHedron.position);

    this.scene.add(this.camera);
  }

  /** Renderer init settings */
  setRenderer(): void {
    this.renderer.setClearColor(0xe232222, 1);
    this.renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);
  }

  /** Use clock to animate movements in scene each frame */
  animate(): void {
    window.requestAnimationFrame(() => this.animate());
    this.elapsedTime = this.clock.getElapsedTime();
    this.controls.update();
    this.delta = Math.min(this.clock.getDelta(), 0.1);
    this.physicsWorld.step(this.delta);
    
    //console.log(this.icosahedronBody.position.x, this.icosahedronBody.position.y, this.icosahedronBody.position.z)
    //console.log(this.charHedron.position.x, this.charHedron.position.y, this.charHedron.position.z)
    this.charHedron.position.set(
      this.icosahedronBody.position.x,
      this.icosahedronBody.position.y,
      this.icosahedronBody.position.z
    )
    this.charHedron.quaternion.set(
      this.icosahedronBody.quaternion.x,
      this.icosahedronBody.quaternion.y,
      this.icosahedronBody.quaternion.z,
      this.icosahedronBody.quaternion.w
    )
    this.renderer.render(this.scene, this.camera);
    this.stats !== undefined ? this.stats.update() : null;
  }

  /** Bind key events to actions */
  actKeydown(event: { key: string }) {
    if (event.key == 'w') {
      this.speedVector.x += 1;
    }
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
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // gestion de la physique
  physics(): void {
    this.physicsWorld = new CANNON.World()
    this.physicsWorld.gravity.set(0, -9.82, 0)
  }

}
