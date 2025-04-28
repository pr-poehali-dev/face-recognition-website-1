
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Camera, CameraOff, Scissors } from "lucide-react";

interface WebcamCaptureProps {
  onCapture?: (imageUrl: string) => void;
  onCameraToggle?: (isActive: boolean) => void;
}

export const WebcamCapture = ({ onCapture, onCameraToggle }: WebcamCaptureProps) => {
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
      if (onCameraToggle) onCameraToggle(true);
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
    if (onCameraToggle) onCameraToggle(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || !onCapture) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Установка размеров canvas в соответствии с видео
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Отрисовка текущего кадра видео на canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Преобразование canvas в URL данных изображения
    const imageUrl = canvas.toDataURL('image/png');
    onCapture(imageUrl);
  };

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (isActive) {
        stopCamera();
      }
    };
  }, [isActive]);

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
          className="hidden" // Скрываем canvas, он нужен только для обработки
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {!isActive ? (
          <Button
            onClick={startCamera}
            className="bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            <Camera className="mr-2 h-4 w-4" />
            Включить камеру
          </Button>
        ) : (
          <>
            <Button
              onClick={captureFrame}
              className="bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Scissors className="mr-2 h-4 w-4" />
              Сделать снимок
            </Button>
            
            <Button
              onClick={stopCamera}
              className="bg-red-600 hover:bg-red-700 transition-colors"
            >
              <CameraOff className="mr-2 h-4 w-4" />
              Выключить камеру
            </Button>
          </>
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
