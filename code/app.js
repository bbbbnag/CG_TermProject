import * as THREE from '../three/build/three.module.js';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';

window.onload = function init() {

  const canvas = document.getElementById("gl-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.width, canvas.height);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  camera.position.z = -15;
  camera.position.y = 0;
  camera.rotation.x = THREE.MathUtils.degToRad(-30);


  var car
  var loader = new GLTFLoader();
  loader.load('../model/scene.gltf', function (gltf) {
    car = gltf.scene;
    car.scale.set(100, 100, 100);
    car.castShadow = true;
    scene.add(car);

    animate();
    const box = new THREE.Box3().setFromObject(car);
    console.log('Bounding Box Min:', box.min);
    console.log('Bounding Box Max:', box.max);
  }, undefined, function (error) {
    console.error(error);
  });
  
  function animate() {
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}
}
