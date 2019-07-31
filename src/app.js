import * as THREE from 'three';
import Microphone, { updateSensitivity } from '@faebeee/lab-utils/libs/microphone';
import Lab from '@faebeee/lab-utils';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const SENSITIVITY = 0.05;
const analyser = Microphone();
const frequencyArray = new Float32Array(analyser.frequencyBinCount);

Lab.init(WIDTH, HEIGHT);
Lab.camera.position.set(0, 0, 100);
Lab.camera.lookAt(0, 0, 0);

Lab.update = () => {
    analyser.getFloatTimeDomainData(frequencyArray);
    const noise = updateSensitivity(frequencyArray, SENSITIVITY);
};

function update() {
    Lab.render();
    requestAnimationFrame(update);
}

update();
