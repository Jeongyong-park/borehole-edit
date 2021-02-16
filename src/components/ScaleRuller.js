import { createRef, useEffect } from "react";

/**
 *
 * @typedef {object} ScaleRullerParams
 * @property {number} scale 스케일(n pixel / 1 meter)
 * @property {number} sumOfThickness 두께의 합
 * @property {number} width 폭(px)
 */

/**
 * 스케일바 렌더러
 * @param {ScaleRullerParams} props
 */
export const ScaleRuller = ({ scale, sumOfThickness, width = 100 }) => {
  const canvasRef = createRef();
  const height = sumOfThickness * scale;

  // round pixelRatio, because older devices have a pixelRatio of 1.5. Treat them as @2x devices
  const pixelRatio = Math.round(window.devicePixelRatio) || 1;
  const collectedWidth = width * pixelRatio;
  const collectedHeight = height * pixelRatio;

  useEffect(() => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = canvasRef.current;
    /**
     * @type {CanvasRenderingContext2D}
     */
    const ctx = canvas.getContext("2d");

    canvasRef.current.width = collectedWidth;
    canvasRef.current.height = collectedHeight;
    canvas.style.width = `${Math.round(collectedWidth / pixelRatio)}px`;
    canvas.style.height = `${Math.round(collectedHeight / pixelRatio)}px`;
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

  return <canvas ref={canvasRef} width={width} height={height} />;
};
