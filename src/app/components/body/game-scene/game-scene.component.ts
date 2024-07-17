import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
  charHedronMesh!: THREE.Mesh;
  elapsedTime: number = 0;
  stats!: Stats;
  controls!: OrbitControls;
  delta: number = 0;
  morphic: any[] = [];
  isMorphing: boolean = false;
  sphereBody: CANNON.Body = new CANNON.Body({ mass: 1 });
  charControl: [boolean, boolean, boolean, boolean] = [false, false, false, false];


  //Physics variables
  groundBody!: CANNON.Body;
  world!: CANNON.World;

  //Character variables
  charHedron: any;
  charLevel: number = 0;
  speedVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  canvasSizes = {
    width: window.innerWidth,
    height: window.innerHeight * 0.93,
  };

  camera = new THREE.PerspectiveCamera(
    75,
    this.canvasSizes.width / this.canvasSizes.height,
    0.001,
    10000
  );

  ngOnInit(): void {
    this.createThreeJsScene();
    // this.material.vertexColors = true;
    this.clock.start();
    this.renderer.setClearColor(0xe232222, 1);
    this.renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);
    this.loadMorphs();
    this.resizeListener();

    // controle de la camera
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableDamping = true;

    // statistiques
    // this.stats = new Stats();
    // document.body.appendChild(this.stats.dom);

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
    window.addEventListener('keyup', (event) => {
      this.actKeyup(event);
    });
    this.loadWorld();
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

    this.charHedronMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(10, 0),
      this.material
    );
    this.charHedronMesh.position.set(0, 200, 0)

    this.charHedron = new THREE.Mesh(
      new THREE.TetrahedronGeometry(10, 0),
      this.material
    );
    this.charHedron.rotation.set(-Math.PI / 4 - 0.2, -Math.PI / 4, 0);
    this.scene.add(this.charHedron);

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
    this.camera.position.y = 100;
    this.camera.position.z = 50;
    this.camera.castShadow = true;
    this.camera.receiveShadow = true;

    this.camera.lookAt(0, 0, 0);


    this.scene.add(this.camera);
  }

  /** Use clock to animate movements in scene each frame */
  animate(): void {
    this.elapsedTime = this.clock.getElapsedTime();
    let move = [0, 0]
    if (this.charControl[1]) { move[0] = 1; }
    else if (this.charControl[3]) { move[0] = -1; }
    else { move[0] = 0; }

    if (this.charControl[2]) { move[1] = 1; }
    else if (this.charControl[0]) { move[1] = -1; }
    else { move[1] = 0; }
    this.sphereBody.applyImpulse(new CANNON.Vec3(move[0] * 5, 0, move[1] * 5));
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.animate());
    this.elapsedTime = this.clock.getElapsedTime();
    this.world.step(0.1);

    this.charHedron.position.set(this.sphereBody.position.x, this.sphereBody.position.y, this.sphereBody.position.z)
    this.charHedron.quaternion.set(
      this.sphereBody.quaternion.x,
      this.sphereBody.quaternion.y,
      this.sphereBody.quaternion.z,
      this.sphereBody.quaternion.w
    )
    this.camera.lookAt(this.charHedronMesh.position);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.stats !== undefined ? this.stats.update() : null;
  }

  /** Bind key events to actions */
  actKeydown(event: { key: string }) {
    if (event.key == 'w') {
      this.charControl[0] = true;
    }
    if (event.key == 'd') {
      this.charControl[1] = true;
    }
    if (event.key == 's') {
      this.charControl[2] = true;
    }
    if (event.key == 'a') {
      this.charControl[3] = true;
    }

    if (event.key == 'u') {
      this.evolveGeometry(1);
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

  actKeyup(event: { key: string }) {
    if (event.key == 'w') {
      this.charControl[0] = false;
    }
    if (event.key == 'd') {
      this.charControl[1] = false;
    }
    if (event.key == 's') {
      this.charControl[2] = false;
    }
    if (event.key == 'a') {
      this.charControl[3] = false;
    }
  }

  evolveGeometry(phase: number) {
    if (phase == 1 && !this.isMorphing && this.charLevel < 4) {
      console.log("phase 1");
      this.isMorphing = true;
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
        new THREE.DodecahedronGeometry(12),
        new THREE.IcosahedronGeometry(12),
      ];
      if (this.charLevel < 4) { this.charLevel++; }
      this.charHedron = new THREE.Mesh(
        geometryLine[this.charLevel],
        this.material
      );
      this.scene.add(this.charHedron);
      this.isMorphing = false;
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
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.82, 0)
    this.scene.add(this.charHedron)
    const sphereShape = new CANNON.Sphere(10)
    this.sphereBody.addShape(sphereShape)
    this.sphereBody.position.x = 0;
    this.sphereBody.position.y = 200;
    this.sphereBody.position.z = 0;
    this.sphereBody.linearDamping = 0.5;
    this.sphereBody.angularDamping = 0.5;

    const planeGeometry = new THREE.PlaneGeometry(250, 250)
    const planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
    planeMesh.rotateX(-Math.PI / 2)
    planeMesh.receiveShadow = true
    this.scene.add(planeMesh)
    const planeShape = new CANNON.Plane()
    const planeBody = new CANNON.Body({ mass: 0 })
    planeBody.addShape(planeShape)
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    this.world.addBody(planeBody)
    this.world.addBody(this.sphereBody)
  }


  /** Loading morph shapes */
  loadMorphs() {
    let loader = new GLTFLoader();

    loader.load('assets/shapes/tetratocube.glb', (gltf) => {
      this.morphic[0] = gltf.scenes[0].children[0];
      this.morphic[0].material = new THREE.MeshNormalMaterial();
      this.morphic[0].scale.set(8, 8, 8);
      this.morphic[0].morphTargetInfluences[0] = 1;
    });

    loader.load('assets/shapes/octacube.glb', (gltf) => {
      this.morphic[1] = gltf.scenes[0].children[0];
      this.morphic[1].material = new THREE.MeshNormalMaterial();
      this.morphic[1].scale.set(11, 11, 11);
      this.morphic[1].morphTargetInfluences[0] = 1;
    });

    loader.load('assets/shapes/octaToDode.glb', (gltf) => {
      this.morphic[2] = gltf.scenes[0].children[0];
      this.morphic[2].material = new THREE.MeshNormalMaterial();
      this.morphic[2].scale.set(11, 11, 11);
      this.morphic[2].morphTargetInfluences[0] = 1;
      this.morphic[2].rotation.set(-Math.PI / 2, 0, 0);
    });

    loader.load('assets/shapes/dodeToIco.glb', (gltf) => {
      this.morphic[3] = gltf.scenes[0].children[0];
      this.morphic[3].material = new THREE.MeshNormalMaterial();
      this.morphic[3].scale.set(15, 15, 15);
      this.morphic[3].morphTargetInfluences[0] = 1;
      this.morphic[3].rotation.set(-Math.PI / 2, 0, 0);
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
      if (this.charLevel >= 1) {
        this.morphic[this.charLevel].morphTargetInfluences[1] = morphProgress;
      }
      // if (this.charLevel == 2) {
      //   this.morphic[this.charLevel].morphTargetInfluences[1] = 1 - morphProgress;
      // }
    }, 10); // Run every 100 milliseconds
  }
}
