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
        🏀 STEP 2: Take Your Actual Shots
      </h3>
      
      {/* Basketball Court Visualization */}
      <div className="mb-6">
        <BasketballCourt showAnimation={showAnimation} shotResult={shotResult} />
      </div>

      {/* Current Shot Info */}
      <div className="mb-4 p-3 bg-orange-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">
            Current Shot: {currentShotIndex + 1}/3
          </span>
          <span className="text-sm text-gray-600">
            Your Prediction: {predictions[currentShotIndex] !== undefined 
              ? (predictions[currentShotIndex] ? '✅ Make' : '❌ Miss')
              : 'No prediction'
            }
          </span>
        </div>
      </div>

      {/* Shot Buttons */}
      {currentShotIndex < 3 && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              // Smart shooting system - 75% alignment with user's prediction
              const userPrediction = predictions[currentShotIndex];
              let isSuccessful;
              
              if (userPrediction !== undefined) {
                // 75% chance the user's prediction is correct
                const shouldMatchPrediction = Math.random() < 0.75;
                isSuccessful = shouldMatchPrediction ? userPrediction : !userPrediction;
              } else {
                // 60% success rate if no prediction
                isSuccessful = Math.random() < 0.6;
              }
              
              handleShot(isSuccessful);
            }}
            disabled={disabled || showAnimation}
            className="px-12 py-6 bg-orange-500 text-white rounded-lg font-bold text-xl hover:bg-orange-600 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            🏀 Take Shot
          </button>
        </div>
      )}

      {/* Shot Results */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700 mb-2">Shot Results:</h4>
        {[1, 2, 3].map((shotNumber, index) => (
          <div key={shotNumber} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">
              Shot {shotNumber}
            </span>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Prediction: {predictions[index] !== undefined 
                  ? (predictions[index] ? '✅' : '❌')
                  : '⏳'
                }
              </span>
              
              <span className="text-sm">
                Result: {shots[index] !== undefined 
                  ? (shots[index] ? '🎯' : '💥')
                  : (index === currentShotIndex && showAnimation ? '🏀' : '⏳')
                }
              </span>
              
              <span className="text-sm font-medium">
                {shots[index] !== undefined && predictions[index] !== undefined
                  ? (shots[index] === predictions[index] ? '✅ Correct' : '❌ Wrong')
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