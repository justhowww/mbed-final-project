import { useEffect, useRef } from "react";

export const useAnimationFrame = (callback: { (delta: any): Promise<void>; (arg0: number): void; }, shouldAnimate = false) => {
  const frameRef = useRef(0);
  const timeRef = useRef<number>();

  const animate = (time: number) => {
    if (timeRef.current != undefined && time) {
      const deltaTime = time - timeRef.current;
      callback(deltaTime);
    }
    timeRef.current = time;
    frameRef.current = requestAnimationFrame(animate);
  };
 
  useEffect(() => {
    if (shouldAnimate) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(frameRef.current);
    }

    return () => cancelAnimationFrame(frameRef.current);
  }, [shouldAnimate]);
};
