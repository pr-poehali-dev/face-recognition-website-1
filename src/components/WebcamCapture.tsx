
import { useEffect, useRef, useState } from "react";

interface WebcamCaptureProps {
  onFrame?: (canvas: HTMLCanvasElement) => void;
}

export const WebcamCapture = ({ onFrame }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      videoRef.current.srcObject = stream;
      setIsActive(true);
      setError(null);
    } catch (err) {
      setError("Не удалось получить доступ к камере. Пожалуйста, убедитесь, что камера подключена и вы дали разрешение на её использование.");
      console.error("Ошибка доступа к камере:", err);
    }
  };

  const stopCamera = () => {
    if (!videoRef.current) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current || !onFrame) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    let animationId: number;
    
    const updateCanvas = () => {
      if (video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        onFrame(canvas);
      }
      animationId = requestAnimationFrame(updateCanvas);
    };
    
    animationId = requestAnimationFrame(updateCanvas);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, onFrame]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative overflow-hidden rounded-lg shadow-xl bg-black mb-4">
        <video
          ref={videoRef}
          className="w-full h-auto"
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
      
      <div className="flex space-x-4">
        {!isActive ? (
          <button
            onClick={startCamera}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            Включить камеру
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Выключить камеру
          </button>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};
