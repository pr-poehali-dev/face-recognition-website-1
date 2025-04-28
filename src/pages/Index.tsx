
import { useState } from "react";
import { WebcamCapture } from "../components/WebcamCapture";

export default function Index() {
  const [detectionCount, setDetectionCount] = useState(0);
  
  const handleFrame = (canvas: HTMLCanvasElement) => {
    // В будущем здесь можно добавить логику распознавания лиц
    // Пока просто симулируем случайное количество лиц для демонстрации интерфейса
    const randomFaces = Math.floor(Math.random() * 3);
    if (Math.random() > 0.9) { // Обновляем не слишком часто
      setDetectionCount(randomFaces);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Распознавание лиц</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Система для распознавания лиц с веб-камеры вашего устройства в реальном времени
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <WebcamCapture onFrame={handleFrame} />
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Результаты</h2>
            
            <div className="flex items-center justify-center p-4 bg-purple-50 rounded-lg mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{detectionCount}</div>
                <div className="text-gray-600">
                  {detectionCount === 1 ? "лицо обнаружено" : 
                   detectionCount > 1 && detectionCount < 5 ? "лица обнаружено" : 
                   "лиц обнаружено"}
                </div>
              </div>
            </div>
            
            <div className="text-gray-600 text-sm">
              <p className="mb-2">
                <strong>Примечание:</strong> Это базовая демонстрация. Текущая версия использует стандартное API камеры без реального распознавания лиц.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
