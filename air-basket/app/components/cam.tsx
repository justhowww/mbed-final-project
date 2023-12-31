"use client";
import { useEffect, useRef, useState } from "react";

import "@tensorflow/tfjs-backend-webgl";
import { drawHands, transformLandmarks } from "../lib/_utils";
import { useAnimationFrame } from "../lib/hook/_useAnimationFrame";
import GE from "../lib/gesture/_fivefingers";
import { setupCanvas, setupVideo, setupDetector } from "../lib/_setup";

export default function Cam() {
  const detectorRef = useRef<any>();
  const videoRef = useRef<HTMLVideoElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    async function initialize() {
      videoRef.current = (await setupVideo()) as HTMLVideoElement;
      const ctx = await setupCanvas(videoRef.current);
      detectorRef.current = await setupDetector();
      setCtx(ctx || undefined);
    }
    initialize();
  }, []);

  useAnimationFrame(async (delta: any) => {
    const hands = await detectorRef.current.estimateHands(videoRef.current, {
      FlipLeftRight: false,
    });
    if (hands.length > 0) {
      const estimatedGestures = GE.estimate(
        transformLandmarks(hands[0].keypoints3D),
        8
      );
      console.log(estimatedGestures.gestures);
    }
    if (ctx && videoRef.current) {
      ctx.clearRect(
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );
    }
    if (ctx) drawHands(hands, ctx);
  }, !!(detectorRef.current && videoRef.current && ctx));

  return (
    <div className="mt-2 border-4 border-blue-500 ">
      <canvas
        className="transform scaleX(-1) z-10 rounded-lg shadow-md "
        id="canvas"
      ></canvas>
      <video
        className="hidden transform scaleX(-1) "
        id="video"
        playsInline
      ></video>
    </div>
  );
}
