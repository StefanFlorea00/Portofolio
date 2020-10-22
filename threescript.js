const scene = new THREE.Scene();
let CAMERASTOP = false;
let composer;

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.updateProjectionMatrix();
camera.position.y = 0.5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.querySelector(".canvas-wrapper").appendChild(renderer.domElement);

const material = new THREE.MeshLambertMaterial({
  color: 0xaa1111,
});

// for (let i = 0; i <= 30; i++) {
//   const geometry = new THREE.BoxGeometry(0.5, 3, 0.5);
//   const cube = new THREE.Mesh(geometry, material);
//   scene.add(cube);
//   cube.position.set(getRandomNr(-8, 8), getRandomNr(-2.5, -1), getRandomNr(-3, -10));
// }

const geometry = new THREE.BoxGeometry(55, 0.2, 35);
const ground = new THREE.Mesh(geometry, material);
// scene.add(ground);
ground.position.set(0, -2.5, -15);

let directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(-1, -1, -1);
directionalLight.castShadow = true;
scene.add(directionalLight);

let circleGeo = new THREE.CircleGeometry(35, 50);
let circleMat = new THREE.MeshBasicMaterial({ color: 0x9bc1e4 }); // 0xaeaeae
let circle = new THREE.Mesh(circleGeo, circleMat);
circle.position.set(-70, -30, -150);
circle.rotation.set(0, 0, 0);
scene.add(circle);

var light = new THREE.AmbientLight(0x8e8e8e); // soft white light
scene.add(light);

scene.fog = new THREE.FogExp2(0xcccccc, 0.2);
renderer.setClearColor(scene.fog.color);

let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, circle, {
  resolutionScale: 1,
  density: 2,
  decay: 0.8,
  weight: 0.9,
  samples: 65,
});

let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
let effectPass = new POSTPROCESSING.EffectPass(camera, godraysEffect);
effectPass.renderToScreen = true;

composer = new POSTPROCESSING.EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);

let loader = new THREE.GLTFLoader();
let cameraObj;
loader.load("Thing.gltf", function (gltf) {
  cameraObj = gltf.scene.children[0];
  cameraObj.position.set(-0.1, 0.5, -10);
  cameraObj.scale.set(0.5, 0.5, 0.5);
  scene.add(gltf.scene);
});

function animate() {
  if (!CAMERASTOP) {
    camera.position.z -= 0.005;
    if (camera.position.z <= -10) camera.position.z = 0;
  }

  if (cameraObj) cameraObj.rotation.z += 0.001;

  // circle.position.x += 0.01;
  // circle.position.y += 0.002;

  requestAnimationFrame(animate);
  composer.render(0.1);
}
animate();

function getRandomNr(min, max) {
  return Math.random() * (max - min) + min;
}

// function updateCamera(ev) {
//   if (window.scrollY <= 100) camera.rotation.y = 0;
//   camera.position.z = -window.scrollY / 100.0;
//   if (window.scrollY <= 900) {
//     camera.position.y = 0 - window.scrollY / 700.0;
//   } else if (window.scrollY >= 1100) {
//   }
//   if (camera.rotation.x >= -0.3) {
//     camera.rotation.x = -window.scrollY / 10000;
//     console.log(camera.rotation.x);
//   }
//   console.log(window.scrollY);
//   CAMERASTOP = true;
//   if (window.scrollY == 0) CAMERASTOP = false;
// }

function updateCamera(ev) {
  if (window.scrollY <= 800) camera.rotation.y = -window.scrollY / 2000.0;
}
window.addEventListener("scroll", updateCamera);
