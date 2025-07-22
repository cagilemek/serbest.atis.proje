'use client';

import React from 'react';
import BasketballCourt from './BasketballCourt';

interface ShotPanelProps {
  shots: boolean[];
  onShotTaken: (index: number, result: boolean) => void;
  predictions: boolean[];
  disabled?: boolean;
  currentShotIndex: number;
}

export default function ShotPanel({ 
  shots, 
  onShotTaken, 
  predictions, 
  disabled = false,
  currentShotIndex 
}: ShotPanelProps) {
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [shotResult, setShotResult] = React.useState<boolean | null>(null);

  const handleShot = async (result: boolean) => {
    if (currentShotIndex >= 3) return;
    
    setShowAnimation(true);
    setShotResult(result);
    
    // Animation duration
    setTimeout(() => {
      onShotTaken(currentShotIndex, result);
      setShowAnimation(false);
      setShotResult(null);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-orange-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🏀 Atışlarınızı Yapın
      </h3>
      
      {/* Basketball Court Visualization */}
      <div className="mb-6">
        <BasketballCourt showAnimation={showAnimation} shotResult={shotResult} />
      </div>

      {/* Current Shot Info */}
      <div className="mb-4 p-3 bg-orange-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">
            Mevcut Atış: {currentShotIndex + 1}/3
          </span>
          <span className="text-sm text-gray-600">
            Tahmininiz: {predictions[currentShotIndex] !== undefined 
              ? (predictions[currentShotIndex] ? '✅ Girer' : '❌ Girmez')
              : 'Tahmin yok'
            }
          </span>
        </div>
      </div>

      {/* Shot Buttons */}
      {currentShotIndex < 3 && (
        <div className="flex space-x-4 justify-center mb-6">
          <button
            onClick={() => handleShot(true)}
            disabled={disabled || showAnimation}
            className="px-8 py-4 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            🎯 Basket!
          </button>
          
          <button
            onClick={() => handleShot(false)}
            disabled={disabled || showAnimation}
            className="px-8 py-4 bg-red-500 text-white rounded-lg font-bold text-lg hover:bg-red-600 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            ❌ Kaçtı!
          </button>
        </div>
      )}

      {/* Shot Results */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700 mb-2">Atış Sonuçları:</h4>
        {[1, 2, 3].map((shotNumber, index) => (
          <div key={shotNumber} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">
              {shotNumber}. Atış
            </span>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Tahmin: {predictions[index] !== undefined 
                  ? (predictions[index] ? '✅' : '❌')
                  : '⏳'
                }
              </span>
              
              <span className="text-sm">
                Sonuç: {shots[index] !== undefined 
                  ? (shots[index] ? '🎯' : '💥')
                  : (index === currentShotIndex && showAnimation ? '🏀' : '⏳')
                }
              </span>
              
              <span className="text-sm font-medium">
                {shots[index] !== undefined && predictions[index] !== undefined
                  ? (shots[index] === predictions[index] ? '✅ Doğru' : '❌ Yanlış')
                  : ''
                }
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}