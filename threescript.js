const scene = new THREE.Scene();
let CAMERASTOP = false;

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.querySelector(".canvas-wrapper").appendChild(renderer.domElement);

const material = new THREE.MeshLambertMaterial({
  color: 0xf0f0f0,
});

for (let i = 0; i <= 30; i++) {
  const geometry = new THREE.BoxGeometry(0.5, 3, 0.5);
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.set(getRandomNr(-8, 8), getRandomNr(-2.5, -1.5), getRandomNr(-3, -10));
}

const geometry = new THREE.BoxGeometry(25, 0.2, 35);
const ground = new THREE.Mesh(geometry, material);
scene.add(ground);
ground.position.set(0, -2.5, -15);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const hlight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
hlight.position.set(-9, -3, -5);
scene.add(hlight);
hlight.castShadow = true;
hlight.shadowDarkness = 1;
hlight.shadowMapSoft = true;

const directionalLight = new THREE.DirectionalLight(0xf0f0f0, 0.1);
directionalLight.rotation.z = 5;
directionalLight.castShadow = true;
directionalLight.shadowDarkness = 1;
directionalLight.shadowMapSoft = true;
scene.fog = new THREE.FogExp2(0xf0f0f0, 0.2);
renderer.setClearColor(scene.fog.color);
scene.add(directionalLight);

let loader = new THREE.GLTFLoader();
let cameraObj;
loader.load("Camera.gltf", function (gltf) {
  cameraObj = gltf.scene.children[0];
  cameraObj.scale.set(0.2, 0.4, 0.6);
  cameraObj.position.set(-1.1, -1.8, -15);
  cameraObj.rotation.set(0, 0, 0);
  scene.add(gltf.scene);
});

function animate() {
  if (!CAMERASTOP) {
    camera.position.z -= 0.005;
    if (camera.position.z <= -6) camera.position.z = 0;
  }

  if (cameraObj) cameraObj.rotation.y += 0.005;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function getRandomNr(min, max) {
  return Math.random() * (max - min) + min;
}

function updateCamera(ev) {
  if (window.scrollY <= 100) camera.rotation.y = 0;
  camera.position.z = -window.scrollY / 100.0;
  if (window.scrollY <= 900) {
    camera.position.y = 0 - window.scrollY / 700.0;
  } else if (window.scrollY >= 1100) {
  }
  if (camera.rotation.x >= -0.3) {
    camera.rotation.x = -window.scrollY / 10000;
    console.log(camera.rotation.x);
  }
  console.log(window.scrollY);
  CAMERASTOP = true;
  if (window.scrollY == 0) CAMERASTOP = false;
}

window.addEventListener("scroll", updateCamera);
