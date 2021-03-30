import "./style.css";
import * as THREE from "three";

let Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
};

const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const aspectRatio = sizes.width / sizes.height;
const fieldOfView = 60;
const nearPlane = 1;
const farPlane = 10000;
scene.fog = new THREE.Fog("#B581B4", 100, 1000);

const camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
);

camera.position.x = 0;
camera.position.z = 200;
camera.position.y = 100;

const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

shadowLight.position.set(150, 350, 350);

shadowLight.castShadow = true;

shadowLight.shadow.camera.left = -400;
shadowLight.shadow.camera.right = 400;
shadowLight.shadow.camera.top = 400;
shadowLight.shadow.camera.bottom = -400;
shadowLight.shadow.camera.near = 1;
shadowLight.shadow.camera.far = 1000;

shadowLight.shadow.mapSize.width = 2048;
shadowLight.shadow.mapSize.height = 2048;

scene.add(hemisphereLight);
scene.add(shadowLight);

const geometry = new THREE.SphereBufferGeometry(350, 10, 10);

const material = new THREE.MeshPhongMaterial({
  color: Colors.brown,
  transparent: true,
  opacity: 0.6,
  flatShading: THREE.FlatShading,
});

const earth = new THREE.Mesh(geometry, material);
earth.position.y = -265;
scene.add(earth);

const clouds = new THREE.Group();
scene.add(clouds);

for (let i = 0; i < 30; i++) {
  const cloud = new THREE.Group();

  let cloudGeometry = new THREE.BoxGeometry(20, 20, 20);
  let cloudMaterial = new THREE.MeshPhongMaterial({
    color: Colors.white,
  });

  let cloudParts = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < cloudParts; i++) {
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

    cloudMesh.position.x = i * 10;
    cloudMesh.position.y = 100;
    cloudMesh.position.z = Math.random() * 10;
    cloudMesh.rotation.z = Math.random() * Math.PI * 2;

    let CloudSizes = 0.1 + Math.random() * 0.9;
    cloudMesh.scale.set(CloudSizes, CloudSizes, CloudSizes);

    cloudMesh.castShadow = true;
    cloudMesh.receiveShadow = true;

    cloud.add(cloudMesh);
  }

  const stepAngle = (Math.PI * 2) / 10;
  const angle = stepAngle * i;
  const h = 350 + Math.random() * 200; // this is the distance between the center of the axis and the cloud itself

  cloud.position.y = Math.sin(angle) * (h / 4);
  cloud.position.x = Math.cos(angle) * (h * 4);
  cloud.position.z = -400 - Math.random() * 150;

  const skySizes = 1 + Math.random() * 2;
  cloud.scale.set(skySizes, skySizes, skySizes);
  clouds.add(cloud);
}

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function loop() {
  earth.rotation.z += 0.005;
  clouds.position.x -= 1;

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

loop();

const container = document.getElementById("world");
container.appendChild(renderer.domElement);
