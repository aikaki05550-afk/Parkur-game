let scene, camera, renderer, player;
let velocity = new THREE.Vector3();
let moveDir = new THREE.Vector3();
let yaw = 0, pitch = 0;
let keys = {};
let platforms = [];
let currentLevel = 1;
let isFirstPerson = true;

// Ссылки на звуки
const stepSound = document.getElementById("stepSound");
const jumpSound = document.getElementById("jumpSound");

function startGame() {
    const color = document.getElementById("clothes").value;
    document.getElementById("menu").style.display = "none";
    document.getElementById("ui").style.display = "block";
    
    init(parseInt(color, 16));
    loadLevel(currentLevel);
    animate();
}

function init(playerColor) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Небо
    scene.fog = new THREE.Fog(0x87ceeb, 10, 80);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Освещение
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(5, 20, 10);
    sun.castShadow = true;
    scene.add(sun);

    // Модель игрока
    player = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 1.2, 0.4),
        new THREE.MeshStandardMaterial({ color: playerColor })
    );
    body.position.y = 0.6;
    body.castShadow = true;
    player.add(body);
    
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.MeshStandardMaterial({ color: 0xffdbac })
    );
    head.position.y = 1.4;
    player.add(head);

    scene.add(player);

    // Захват мыши
    document.body.addEventListener('click', () => {
        if (document.getElementById("menu").style.display === "none") {
            document.body.requestPointerLock();
        }
    });

    window.addEventListener("mousemove", (e) => {
        if (document.pointerLockElement) {
            yaw -= e.movementX * 0.002;
            pitch -= e.movementY * 0.002;
            pitch = Math.max(-1.5, Math.min(1.5, pitch));
        }
    });

    window.addEventListener("keydown", (e) => {
        keys[e.code] = true;
        if (e.code === 'F5') {
            e.preventDefault();
            isFirstPerson = !isFirstPerson;
        }
    });
    window.addEventListener("keyup", (e) => keys[e.code] = false);
}

function createPlatform(x, y, z, w, h, d, color) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color: color })
    );
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    scene.add(mesh);
    platforms.push(mesh);
}

function loadLevel(num) {
    platforms.forEach(p => scene.remove(p));
    platforms = [];
    document.getElementById("lvl").innerText = num;

    // Старт
    createPlatform(0, 0, 0, 5, 1, 5, 0x55aa55);

    let lastPos = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 5 + num; i++) {
        lastPos.z -= 3 + Math.random() * 2;
        lastPos.y += (Math.random() - 0.2) * 1.5;
        lastPos.x += (Math.random() - 0.5) * 3;
        createPlatform(lastPos.x, lastPos.y, lastPos.z, 2, 0.5, 2, 0x888888);
    }

    // Финиш (Золотой блок)
    createPlatform(lastPos.x, lastPos.y, lastPos.z - 4, 3, 0.5, 3, 0xffd700);
    
    player.position.set(0, 2, 0);
    velocity.set(0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);

    let speed = keys["ShiftLeft"] ? 0.16 : 0.09;
    let forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).negate();
    let right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).negate();

    moveDir.set(0, 0, 0);
    if (keys["KeyW"]) moveDir.add(forward);
    if (keys["KeyS"]) moveDir.sub(forward);
    if (keys["KeyA"]) moveDir.sub(right);
    if (keys["KeyD"]) moveDir.add(right);

    if (moveDir.length() > 0) {
        player.position.add(moveDir.normalize().multiplyScalar(speed));
        // Звук ходьбы (имитация по синусоиде)
        if (velocity.y === 0 && Math.sin(Date.now() * 0.01) > 0.9) {
            stepSound.currentTime = 0;
            stepSound.play().catch(()=>{});
        }
    }

    // Физика
    velocity.y -= 0.015;
    player.position.y += velocity.y;

    // Коллизии
    let ray = new THREE.Raycaster(player.position, new THREE.Vector3(0, -1, 0), 0, 1.1);
    let intersects = ray.intersectObjects(platforms);

    if (intersects.length > 0) {
        let groundY = intersects[0].point.y + 0.1;
        if (player.position.y < groundY + 0.1) {
            player.position.y = groundY;
            velocity.y = 0;
            if (keys["Space"]) {
                velocity.y = 0.3;
                jumpSound.play().catch(()=>{});
            }
        }
        
        if (intersects[0].object.material.color.getHex() === 0xffd700) {
            currentLevel++;
            loadLevel(currentLevel);
        }
    }

    if (player.position.y < -15) loadLevel(currentLevel);

    // Камера
    if (isFirstPerson) {
        camera.position.copy(player.position).add(new THREE.Vector3(0, 1.4, 0));
        camera.rotation.set(pitch, yaw, 0, 'YXZ');
        player.visible = false;
    } else {
        let camOffset = new THREE.Vector3(Math.sin(yaw) * 5, 3, Math.cos(yaw) * 5);
        camera.position.copy(player.position).add(camOffset);
        camera.lookAt(player.position.clone().add(new THREE.Vector3(0, 1, 0)));
        player.visible = true;
    }

    renderer.render(scene, camera);
}