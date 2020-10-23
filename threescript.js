const scene = new THREE.Scene();
let CAMERASTOP = false;
let composer, sun;
let sunGeo, sunMat;
let spiral, cube, cube2;
let directionalLight;
let camera, renderer;
let controls;

let bgOn = true;
document.querySelector("#bg-btn").addEventListener("click", toggle3D);

function toggle3D(event) {
  bgOn = !bgOn;
  if (bgOn) {
    document.querySelector("canvas").classList.remove("hidden");
    event.target.classList.add("active");
    render();
  } else if (!bgOn) {
    document.querySelector("canvas").classList.add("hidden");
    event.target.classList.remove("active");
  }
}

function init() {
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.updateProjectionMatrix();
  camera.position.y = 0.5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // controls = new THREE.OrbitControls(camera, renderer.domElement);

  document.querySelector(".canvas-wrapper").appendChild(renderer.domElement);

  addGeometry();
  addLights();
  addPostProcess();
  animate();
}
init();

function addGeometry() {
  let loader = new THREE.GLTFLoader();
  loader.load("Thing.gltf", function (gltf) {
    spiral = gltf.scene.children[0];
    spiral.position.set(-0.1, 0.5, -10);
    spiral.scale.set(0.5, 0.5, 0.5);
    spiral.traverse((n) => {
      if (n.isMesh) {
        n.castShadow = true;
        n.receiveShadow = true;
      }
    });
    scene.add(gltf.scene);
  });

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  cube2 = new THREE.Mesh(geometry2, material);
  cube.position.set(0, -2, -3);
  cube.rotation.set(0, 1, 1);
  scene.add(cube);
  cube2.position.set(0, -4, -3);
  cube2.rotation.set(0, 1, 1);
  scene.add(cube2);
}

function addPostProcess() {
  let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, sun, {
    resolutionScale: 0.5,
    density: 3,
    decay: 0.8,
    weight: 0.9,
    samples: 100,
  });

  let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
  let effectPass = new POSTPROCESSING.EffectPass(camera, godraysEffect);

  effectPass.renderToScreen = true;

  composer = new POSTPROCESSING.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(effectPass);
}

function addLights() {
  directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(-1, -1, -1);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  sunGeo = new THREE.CircleGeometry(35, 50);
  sunMat = new THREE.MeshBasicMaterial({ color: 0x9bc1e4 }); // 0xaeaeae
  sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(-55, -35, -100);
  sun.rotation.set(0, 0, 0);
  scene.add(sun);

  // var light = new THREE.AmbientLight(0x3e3e3e); // soft white light
  // scene.add(light);

  var hemiLight = new THREE.HemisphereLight(0xffffff, 0x3e3e3e);
  hemiLight.position.set(0, 1000, 0);
  scene.add(hemiLight);

  scene.fog = new THREE.FogExp2(0xcccccc, 0.2);
  renderer.setClearColor(scene.fog.color);
}

function animate() {
  if (!CAMERASTOP) {
    camera.position.z -= 0.005;
    if (camera.position.z <= -10) camera.position.z = 0;
  }

  cube.position.z -= 0.005;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  cube2.position.z -= 0.005;
  cube2.rotation.y += 0.01;
  cube2.rotation.z += 0.01;

  if (spiral) spiral.rotation.z += 0.001;

  render();
}

function render() {
  if (bgOn) {
    requestAnimationFrame(animate);
    composer.render(0.1);
  }
}

function getRandomNr(min, max) {
  return Math.random() * (max - min) + min;
}

function updateCamera(ev) {
  if (window.scrollY <= 800) camera.rotation.y = -window.scrollY / 2000.0;
  cube.position.y = -2 + window.scrollY / 350.0;
  cube2.position.y = -4.3 + window.scrollY / 350.0;
}

function moveCameraMouse(ev) {
  console.log(ev.clientX);
  console.log(ev.clientY);
}

window.addEventListener("mousemove", moveCameraMouse);
window.addEventListener("scroll", updateCamera);
