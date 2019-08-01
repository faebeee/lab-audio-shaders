import * as THREE from 'three';
import Microphone, { updateSensitivity } from '@faebeee/lab-utils/libs/microphone';
import Lab from '@faebeee/lab-utils';

const AMPLIFIER = 10;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const SENSITIVITY = null;
const analyser = Microphone();
const frequencyArray = new Float32Array(analyser.frequencyBinCount);
const VERT_NOISE = 0;

Lab.init(WIDTH, HEIGHT);
Lab.renderer.shadowMap.enabled = true;

Lab.camera.position.set(0, 0, 80);
Lab.camera.lookAt(0, 0, 0);

createLights();
Lab.scene.fog = new THREE.FogExp2(0x000104, 0.0000675);

const planet = createPlanet();
planet.position.set(0, 0, 0);
Lab.scene.add(planet);

Lab.update = () => {
    analyser.getFloatTimeDomainData(frequencyArray);
    const noise = updateSensitivity(frequencyArray, SENSITIVITY);
    const peak = Math.max(...noise);
    const { geometry } = planet;
    const { originalVertices } = planet.userData;
    let counter = 0;
    const vLength = geometry.vertices.length;
    for (let i = 0; i < vLength; i++) {
        const accelerateX = clamp(originalVertices[counter], -1, 1);
        const accelerateY = clamp(originalVertices[counter + 1], -1, 1);
        const accelerateZ = clamp(originalVertices[counter + 2], -1, 1);

        geometry.vertices[i].x = originalVertices[counter] + Math.random() * peak * AMPLIFIER * accelerateX;
        geometry.vertices[i].y = originalVertices[counter + 1] + Math.random() * peak * AMPLIFIER * accelerateY;
        geometry.vertices[i].z = originalVertices[counter + 2] + Math.random() * peak * AMPLIFIER * accelerateZ;
        counter += 3;
    }
    geometry.verticesNeedUpdate = true;
    planet.rotation.y += 0.001;
};

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function createLights() {
    let light = new THREE.PointLight('#fffff0', 1, 150);
    light.castShadow = true;
    light.position.set(-50, 100, 50);
    Lab.scene.add(light);

    let light2 = new THREE.PointLight('#fffff0', 1, 150);
    light2.castShadow = true;
    light2.position.set(50, 100, 50);
    Lab.scene.add(light2);

    let light3 = new THREE.PointLight('#ff0000', 1, 150);
    light3.castShadow = true;
    light3.position.set(0, -50, 50);
    Lab.scene.add(light3);
}

function createPlanet(x, z) {
    const geometry = new THREE.SphereGeometry(15, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: '#51a9ff', flatShading: true });

    const positions = [];
    for (let i = 0; i < geometry.vertices.length; i++) {
        geometry.vertices[i].x += Math.random() * VERT_NOISE;
        geometry.vertices[i].y += Math.random() * VERT_NOISE;
        geometry.vertices[i].z += Math.random() * VERT_NOISE;
        positions.push(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    }
    const planet = new THREE.Mesh(geometry, material);
    planet.userData.originalVertices = positions;
    planet.castShadow = true;
    planet.receiveShadow = true;
    return planet;
}


function update() {
    Lab.render();
    requestAnimationFrame(update);
}

update();
