
import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

interface FaceDetectionOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onFacesDetected?: (count: number) => void;
}

export const FaceDetectionOverlay = ({ videoRef, onFacesDetected }: FaceDetectionOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
    };

    loadModel();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const detectFaces = async () => {
      if (video.readyState !== 4 || !model) {
        animationRef.current = requestAnimationFrame(detectFaces);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const predictions = await model.estimateFaces(video, false);
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      if (predictions.length > 0 && onFacesDetected) {
        onFacesDetected(predictions.length);
      }

      predictions.forEach((prediction) => {
        const start = prediction.topLeft as [number, number];
        const end = prediction.bottomRight as [number, number];
        const size = [end[0] - start[0], end[1] - start[1]];

        // Рамка вокруг лица
        context.beginPath();
        context.strokeStyle = "#4f46e5";
        context.lineWidth = 3;
        context.rect(start[0], start[1], size[0], size[1]);
        context.stroke();

        // Полупрозрачная подсветка
        context.fillStyle = "rgba(79, 70, 229, 0.1)";
        context.fillRect(start[0], start[1], size[0], size[1]);

        // Метка сверху
        context.fillStyle = "#4f46e5";
        context.fillRect(start[0], start[1] - 20, 70, 20);
        context.font = "12px Arial";
        context.fillStyle = "white";
        context.fillText("Лицо", start[0] + 10, start[1] - 5);
      });

      animationRef.current = requestAnimationFrame(detectFaces);
    };

    detectFaces();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [model, videoRef, onFacesDetected]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
