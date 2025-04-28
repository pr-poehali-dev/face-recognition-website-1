
import { useState, useRef } from "react";
import { WebcamCapture } from "../components/WebcamCapture";
import { Button } from "../components/ui/button";
import { Download, RefreshCw } from "lucide-react";

export default function Index() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const handleCapture = (imageUrl: string) => {
    setCapturedImage(imageUrl);
  };

  const handleCameraToggle = (active: boolean) => {
    setIsCameraActive(active);
  };

  const handleDownload = () => {
    if (capturedImage && downloadLinkRef.current) {
      downloadLinkRef.current.href = capturedImage;
      downloadLinkRef.current.download = `webcam-capture-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
      downloadLinkRef.current.click();
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Веб-камера</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Демонстрация изображения с веб-камеры и захват кадров
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <WebcamCapture 
              onCapture={handleCapture} 
              onCameraToggle={handleCameraToggle} 
            />
          </div>
          
          {capturedImage && (
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Сохраненный кадр</h2>
              
              <div className="mb-4 overflow-hidden rounded-lg shadow-md">
                <img 
                  src={capturedImage} 
                  alt="Захваченный кадр" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleDownload}
                  className="bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Скачать изображение
                </Button>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="hover:bg-gray-100 transition-colors"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Сделать новый снимок
                </Button>
                
                <a 
                  ref={downloadLinkRef} 
                  className="hidden"
                />
              </div>
            </div>
          )}

          {!isCameraActive && !capturedImage && (
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in text-center">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Как это работает</h2>
              <div className="max-w-md mx-auto text-left">
                <div className="flex items-start gap-2 mb-3">
                  <div className="bg-purple-100 rounded-full w-6 h-6 flex items-center justify-center text-purple-800 font-bold mt-0.5">1</div>
                  <p className="text-gray-600 flex-1">
                    Нажмите кнопку "Включить камеру" и предоставьте разрешение на доступ к веб-камере
                  </p>
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <div className="bg-purple-100 rounded-full w-6 h-6 flex items-center justify-center text-purple-800 font-bold mt-0.5">2</div>
                  <p className="text-gray-600 flex-1">
                    Когда камера активна, нажмите "Сделать снимок", чтобы захватить текущий кадр
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-purple-100 rounded-full w-6 h-6 flex items-center justify-center text-purple-800 font-bold mt-0.5">3</div>
                  <p className="text-gray-600 flex-1">
                    Сохраните изображение с помощью кнопки "Скачать изображение"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
