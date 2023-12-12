import {
  createDetector,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";
import { fitToContainer } from "./_utils";

export async function setupVideo() {
  const video = document.getElementById("video");
  const stream = await window.navigator.mediaDevices.getUserMedia({
    video: { width: 400, height: 270 },
  });

  video.srcObject = stream;
  await new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve();
    };
  });
  video.play();

  video.width = video.videoWidth;
  video.height = video.videoHeight;

  return video;
}

// export async function setupDetector() {
//   const model = SupportedModels.MediaPipeHands;
//   const detector = await createDetector(model, {
//     runtime: "mediapipe",
//     maxHands: 2,
//     solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
//   });

//   return detector;
// }

export async function setupCanvas(video) {
  const canvas = document.getElementById("canvas");
  fitToContainer(canvas);
  const ctx = canvas.getContext("2d");

  canvas.width = video.width;
  canvas.height = video.height;

  return ctx;
}
