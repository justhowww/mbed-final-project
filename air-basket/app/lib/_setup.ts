import { fitToContainer } from "./_utils";
import {
  createDetector,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";
export async function setupVideo() {
  const video = document.getElementById("video") as HTMLVideoElement | null;
  if (!video) {
    throw new Error("Video element not found");
  }

  const stream = await window.navigator.mediaDevices.getUserMedia({
    video: { width: 400, height: 270 },
  });

  if ('srcObject' in video) {
    video.srcObject = stream;
  } else {
    (video as any).src = stream;
  }

  await new Promise<void>((resolve) => {
    video.onloadedmetadata = () => {
      resolve();
    };
  });


  if ('play' in video) {
    video.play();
  }

  video.width = video.videoWidth || 0;
  video.height = video.videoHeight || 0;

  return video;
}

export async function setupCanvas(video: HTMLVideoElement) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
  if (!canvas) {
    throw new Error("Canvas element not found");
  }

  fitToContainer(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D context not supported");
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  return ctx;

}
export async function setupDetector() {
  const model = SupportedModels.MediaPipeHands;
  const detector = await createDetector(model, {
    runtime: "mediapipe",
    maxHands: 2,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  });

  return detector;
}
