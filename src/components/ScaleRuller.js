import { createRef, useEffect } from "react";

export const ScaleRuller = ({ scale, sumOfThickness, width = 100 }) => {
  const canvasRef = createRef();
  const height = sumOfThickness * scale;

  // round pixelRatio, because older devices have a pixelRatio of 1.5. Treat them as @2x devices
  let pixelRatio = Math.round(window.devicePixelRatio) || 1;
  const collectedWidth = width * pixelRatio;
  const collectedHeight = height * pixelRatio;

  useEffect(() => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = canvasRef.current;
    canvasRef.current.width = collectedWidth;
    canvasRef.current.height = collectedHeight;
    canvas.style.width = Math.round(collectedWidth / pixelRatio) + "px";
    canvas.style.height = Math.round(collectedHeight / pixelRatio) + "px";
    /**
     * @type {CanvasRenderingContext2D}
     */
    const ctx = canvas.getContext("2d");
    ctx.scale(pixelRatio, pixelRatio);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    for (let currentY = 0; currentY <= height; currentY += scale / 5) {
      ctx.beginPath();

      if (currentY % scale < 0.01) {
        ctx.moveTo(width - 20.5, currentY - 0.5);
      } else {
        ctx.moveTo(width - 10.5, currentY - 0.5);
      }
      ctx.lineTo(width, currentY - 0.5);
      ctx.stroke();
    }
  }, [
    canvasRef,
    collectedHeight,
    collectedWidth,
    height,
    pixelRatio,
    scale,
    sumOfThickness,
    width,
  ]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};
