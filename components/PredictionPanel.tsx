'use client';

import React from 'react';

interface PredictionPanelProps {
  predictions: boolean[];
  onPredictionChange: (index: number, value: boolean) => void;
  disabled?: boolean;
}

export default function PredictionPanel({ 
  predictions, 
  onPredictionChange, 
  disabled = false 
}: PredictionPanelProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-orange-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🎯 STEP 1: Make Your Predictions
      </h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Before shooting, predict which shots will be successful
      </p>
      
      <div className="space-y-4">
        {[1, 2, 3].map((shotNumber, index) => (
          <div key={shotNumber} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="font-medium text-gray-700">
              Shot {shotNumber}
            </span>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onPredictionChange(index, true)}
                disabled={disabled}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  predictions[index] === true
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                ✅ Make
              </button>
              
              <button
                onClick={() => onPredictionChange(index, false)}
                disabled={disabled}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  predictions[index] === false
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                ❌ Miss
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 text-center">
          💡 Tip: You earn tokens if your predictions exactly match your shots!
        </p>
      </div>
    </div>
  );
}