
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaceDetectionOverlay } from "@/components/FaceDetectionOverlay";
import { Camera, CameraOff, Zap } from "lucide-react";

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error("Ошибка доступа к камере:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsActive(false);
      setFacesDetected(0);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const toggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
            Распознавание лиц
          </h1>
          <p className="text-lg text-slate-600">
            Включите камеру, чтобы начать распознавание лиц в реальном времени
          </p>
        </div>
      </header>

      <main className="w-full max-w-4xl flex-1 flex flex-col items-center">
        <Card className="w-full p-1 bg-white shadow-xl overflow-hidden relative animate-fade-in">
          <div className="aspect-video w-full relative bg-slate-100 rounded overflow-hidden">
            {isActive && <FaceDetectionOverlay videoRef={videoRef} onFacesDetected={setFacesDetected} />}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isActive ? "opacity-100" : "opacity-50"}`}
            />
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-slate-400 text-xl">Камера отключена</p>
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-4 mt-8 items-center">
          <Button
            size="lg"
            onClick={toggleCamera}
            className={`shadow-md transition-all hover-scale ${
              isActive ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isActive ? (
              <>
                <CameraOff className="mr-2 h-5 w-5" /> Выключить камеру
              </>
            ) : (
              <>
                <Camera className="mr-2 h-5 w-5" /> Включить камеру
              </>
            )}
          </Button>

          <Card className={`px-4 py-2 flex items-center transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-50"}`}>
            <Zap className="h-5 w-5 mr-2 text-amber-500" />
            <span className="text-sm font-medium">
              {isActive ? (
                <>Обнаружено лиц: <span className="font-bold">{facesDetected}</span></>
              ) : (
                "Ожидание..."
              )}
            </span>
          </Card>
        </div>
      </main>

      <footer className="mt-10 text-center text-slate-500 text-sm">
        <p>Разработано с использованием TensorFlow</p>
      </footer>
    </div>
  );
};

export default Index;
