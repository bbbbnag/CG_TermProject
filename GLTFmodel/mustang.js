window.onload = function init() {
    // 속도 설정
    const speed = 0.3;
    let car; // 자동차 모델을 위한 전역 변수로 설정

    // 씬 생성
    const canvas = document.getElementById("gl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.width, canvas.height);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAAA); // 밝은 회색 배경

	const cameraOffset = 5;  // 차량과의 거리
    const cameraHeight = 2;   // 카메라의 높이

    // 카메라 생성
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    camera.position.set(0, 5, 5); // 약간 높게 설정하여 트랙을 바라보는 시점

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0x404040, 50);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-1, 1, 0);
    scene.add(directionalLight);

    // 바닥(트랙) 만들기
    const trackGeometry = new THREE.PlaneGeometry(100, 100); // 100x100 크기의 평면 생성
    const trackMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 }); // 어두운 회색
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.rotation.x = -Math.PI / 2; // 평면을 수평으로 설정
    scene.add(track);

    // GLTFLoader를 통한 자동차 모델 로드
    const loader = new THREE.GLTFLoader();
    loader.load('http://localhost:8080/model2/scene.gltf', function (gltf) {
        car = gltf.scene.children[0];
        car.scale.set(1, 1, 1);
        car.position.set(0, 0.25, 0); // 바닥에서 약간 위에 위치
		camera.position.set(0,0.25,0);
        scene.add(gltf.scene);
        animate();
    }, undefined, function (error) {
        console.error(error);
    });

    // 차량 움직임 제어 변수
    let forward = false, backward = false, left = false, right = false;

    // 키 입력 처리
    document.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowUp') forward = true;
        if (event.code === 'ArrowDown') backward = true;
        if (event.code === 'ArrowLeft') left = true;
        if (event.code === 'ArrowRight') right = true;
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'ArrowUp') forward = false;
        if (event.code === 'ArrowDown') backward = false;
        if (event.code === 'ArrowLeft') left = false;
        if (event.code === 'ArrowRight') right = false;
    });

    // 애니메이션 및 렌더링
    function animate() {
        requestAnimationFrame(animate);

        // 차량 이동
        if (car) {
            if (forward) {
                car.position.x += Math.sin(car.rotation.y) * speed;
                car.position.z += Math.cos(car.rotation.y) * speed;
            }

            if (backward) {
                car.position.x -= Math.sin(car.rotation.y) * speed;
                car.position.z -= Math.cos(car.rotation.y) * speed;
            }

            if (left) {
                car.rotation.z += 0.03; // 회전 속도
            }

            if (right) {
                car.rotation.z -= 0.03; // 회전 속도
            }

          

            // 차량의 회전에 따라 카메라 위치 계산
           
			camera.position.set(
				car.position.x ,                   // 차량의 X 위치
				car.position.y + cameraHeight,    // 차량의 Y 위치 + 카메라 높이
				car.position.z + 5     // 차량의 Z 위치 - 카메라와의 거리
			);
		
            // 카메라가 차량을 바라보도록 설정
            camera.lookAt(car.position);

            // 카메라 위치 출력
            console.log(`Camera Position: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`);
        }

        renderer.render(scene, camera);
    }

    // 창 크기 조절 시 카메라와 렌더러 업데이트
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
