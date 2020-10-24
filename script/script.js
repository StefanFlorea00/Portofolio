const scene = new THREE.Scene();
let CAMERASTOP = false;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 4;
camera.position.x = 3;
camera.position.y = 2.2;

document.querySelector(".canvas-wrapper").appendChild(renderer.domElement);

const material = new THREE.MeshLambertMaterial({
  color: 0x035afc,
  emissive: 0x0,
});

for (let i = 0; i <= 70; i++) {
  const geometry = new THREE.SphereGeometry(getRandomNr(0.1, 0.3), 32, 32);
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = Math.random() * 5;
  sphere.position.y = Math.random() * 5;
  sphere.position.z = Math.random() * 10;
  scene.add(sphere);
}

// var geometryC = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// var cube = new THREE.Mesh(geometryC, material);
// scene.add(cube);
// cube.position.x = -0.5;
// cube.position.y = 2;
// cube.position.z = 4;

const ambientLight = new THREE.AmbientLight(0x404040);
const light = new THREE.PointLight(0xff9f1c, 1, 100);
light.position.set(10, 10, 10);
const directionalLight = new THREE.DirectionalLight(0xb4effd, 0.5);
directionalLight.rotation.z = 5;
directionalLight.castShadow = true;
directionalLight.position.set(-3, 1, 5);
scene.fog = new THREE.FogExp2(0xf0f0f0, 0.5);
renderer.setClearColor(scene.fog.color);

scene.add(light);
scene.add(ambientLight);
scene.add(directionalLight);

let loader = new THREE.GLTFLoader();
let cameraObj;
loader.load("Camera.gltf", function(gltf){
  cameraObj = gltf.scene.children[0];
  cameraObj.scale.set(0.1,0.2,0.3);
  cameraObj.position.set(-1.2,2,4.6);
  cameraObj.rotation.set(0,0,0);
  scene.add(gltf.scene);
})



function animate() {
  // if (!CAMERASTOP) {
  //   camera.position.z -= 0.002;
  //   if (camera.position.z <= 1) camera.position.z = 4;
  // }

  if(cameraObj){
  cameraObj.rotation.y += 0.001;
  camera.lookAt(cameraObj.position.x,cameraObj.position.y+0.3,camera.position.z-0.2);
  }


  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function getRandomNr(min, max) {
  return Math.random() * (max - min) + min;
}

function updateCamera(ev) {
  camera.rotation.y = window.scrollY / 200.0;
  camera.position.x = 3 - window.scrollY / 100.0;
  console.log(camera.position.x);
  CAMERASTOP = true;
  if (window.scrollY == 0) CAMERASTOP = false;
}

window.addEventListener("scroll", updateCamera);
