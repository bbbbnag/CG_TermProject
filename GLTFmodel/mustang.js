window.onload = function init() {
    // 속도 설정
    const speed = 0.3;
    let car; // 자동차 모델을 위한 전역 변수로 설정

	let wheels = []; // 바
	const wheelSpeed = 0.1; // 바퀴 회전 속도 설정

	const wheelRadius = 0.5; // 바퀴의 반지름 (실제 모델에 맞게 수정)
	const wheelCircumference = 2 * Math.PI * wheelRadius; // 바퀴의 둘레
	let distanceTraveled = 0; // 차량이 이동한 거리

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

	let frontLeftWheel, frontRightWheel, rearLeftWheel, rearRightWheel; // 바퀴를 위한 변수들

    // GLTFLoader를 통한 자동차 모델 로드
    const loader = new THREE.GLTFLoader();
    loader.load('http://localhost:8080/model2/scene.gltf', function (gltf) {
        car = gltf.scene; // 기본 자동차 그룹
		
    // 바퀴 찾기
    
    car.traverse((child) => {
        if (child.name.includes("Wheel")) { // 바퀴 이름에 "Wheel"이 포함된 경우
            wheels.push(child); // 바퀴를 배열에 추가
        }
    });

    // 확인: 바퀴 배열 출력
    console.log("Found wheels:", wheels);
	car.scale.set(5, 5, 5);
	car.position.set(0, 0, 0); // 바닥에서 약간 위에 위치
	camera.position.set(0,10.25,-20); // x y z
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

		let moveDistance = 0; // 현재 프레임에서 이동 거리 초기화
        // 차량 이동
        if (car) {
            if (forward) {
                car.position.x += Math.sin(car.rotation.y) * speed;
                car.position.z += Math.cos(car.rotation.y) * speed;
				camera.position.x += Math.sin(car.rotation.y) * speed;
				camera.position.z +=Math.cos(car.rotation.y)*speed;
				wheels.forEach(wheel => {
					wheel.rotation.y += wheelSpeed; // 바퀴 회전
				});
            }

            if (backward) {
                car.position.x -= Math.sin(car.rotation.y) * speed;
                car.position.z -= Math.cos(car.rotation.y) * speed;
				camera.position.x -= Math.sin(car.rotation.y) * speed;
				camera.position.z -=Math.cos(car.rotation.y)*speed;
				wheels.forEach(wheel => {
					// 바퀴의 회전 각도 계산
					const rotationAmount = (moveDistance / wheelCircumference) * (2 * Math.PI); // 굴러가는 각도 계산
					wheel.rotation.x += rotationAmount; // Y축을 기준으로 회전
				});
            }

            if (left) {
                car.rotation.y+= 0.03; // 회전 속도
				camera.rotation.x+=0.03;
            }

            if (right) {
                car.rotation.y-= 0.03; // 회전 속도
				camera.rotation.x-=0.03;
            }
			

			//car.rotation.z +=0.3;

            // 차량의 회전에 따라 카메라 위치 계산
           
			
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
