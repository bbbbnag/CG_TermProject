import * as THREE from '../three/build/three.module.js';
import { FBXLoader } from '../three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';


window.onload = function init() {

  const canvas = document.getElementById("gl-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.width, canvas.height);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // 카메라 변수 선언
  const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
  const contorls = new OrbitControls(camera, renderer.domElement);
  // 조명 추가
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // 카메라 위치 설정
  camera.position.z = 5;
  camera.position.y = 5;
  camera.rotation.x = THREE.MathUtils.degToRad(-30); // -30도 아래로

  // FBX 로더 생성
  const loader = new FBXLoader();
  loader.load('../assets/Hoonicorn.fbx', function (object) {
    // FBX 모델을 씬에 추가
    scene.add(object);
    object.scale.set(0.1, 0.1, 0.1);

    // 애니메이션이 있는지 확인 후 실행
    if (object.animations && object.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(object);
      const action = mixer.clipAction(object.animations[0]);
      action.play();

      // 애니메이션 업데이트용 Clock 추가
      const clock = new THREE.Clock();

      // 렌더링 루프
      function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta(); // 프레임 간 시간 계산
        mixer.update(delta); // delta 시간 만큼 애니메이션 업데이트
        renderer.render(scene, camera);
      }
      animate();
    } else {
      // 애니메이션이 없는 경우에도 렌더링 루프 실행
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
    }
  });
}
