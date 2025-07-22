'use client';

import React from 'react';
import { GameState } from '../hooks/useStacksConnect';

interface GameStatsProps {
  gameState: GameState | null;
  userAddress?: string;
}

export default function GameStats({ gameState, userAddress }: GameStatsProps) {
  const formatBalance = (balance: number) => {
    return (balance / 1000000).toFixed(2); // Convert microSTX to STX
  };

  if (!gameState) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg border border-orange-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          📊 Oyun İstatistikleri
        </h3>
        <p className="text-center text-gray-600">
          Henüz oyun verisi yok. Bir oyun başlatın!
        </p>
      </div>
    );
  }

  const correctPredictions = gameState.predictions.reduce((count, prediction, index) => {
    if (gameState.shots[index] !== undefined) {
      return count + (prediction === gameState.shots[index] ? 1 : 0);
    }
    return count;
  }, 0);

  const completedShots = gameState.shots.filter(shot => shot !== undefined).length;

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-orange-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        📊 Oyun İstatistikleri
      </h3>

      {/* Player Info */}
      {userAddress && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">Oyuncu Adresi:</p>
          <p className="font-mono text-sm break-all">{userAddress}</p>
        </div>
      )}

      {/* Balance */}
      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">💰 Token Bakiyesi:</span>
          <span className="text-2xl font-bold text-orange-600">
            {formatBalance(gameState.balance)} STX
          </span>
        </div>
      </div>

      {/* Game Status */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
          <span className="text-sm font-medium text-gray-700">Oyun Durumu:</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            gameState.completed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {gameState.completed ? '✅ Tamamlandı' : '⏳ Devam Ediyor'}
          </span>
        </div>

        <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
          <span className="text-sm font-medium text-gray-700">Tamamlanan Atış:</span>
          <span className="text-sm font-bold text-blue-600">
            {completedShots}/3
          </span>
        </div>

        {gameState.completed && (
          <>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-sm font-medium text-gray-700">Doğru Tahmin:</span>
              <span className="text-sm font-bold text-blue-600">
                {correctPredictions}/3
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-sm font-medium text-gray-700">Tahmin Başarısı:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                gameState.predictionsMatched 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {gameState.predictionsMatched ? '🎉 Mükemmel!' : '😔 Başarısız'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Detailed Results */}
      {gameState.predictions.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3">Detaylı Sonuçlar:</h4>
          <div className="space-y-2">
            {gameState.predictions.map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span className="text-gray-600">{index + 1}. Atış</span>
                
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">Tahmin:</span>
                    {prediction ? '✅' : '❌'}
                  </span>
                  
                  <span className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">Sonuç:</span>
                    {gameState.shots[index] !== undefined 
                      ? (gameState.shots[index] ? '🎯' : '💥')
                      : '⏳'
                    }
                  </span>
                  
                  {gameState.shots[index] !== undefined && (
                    <span className={`px-1 py-0.5 rounded text-xs ${
                      prediction === gameState.shots[index]
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {prediction === gameState.shots[index] ? 'Doğru' : 'Yanlış'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {gameState.completed && gameState.predictionsMatched && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-green-800 font-medium">
              Tebrikler! Tüm tahminleriniz doğru!
            </p>
            <p className="text-green-700 text-sm mt-1">
              1 STX token kazandınız!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}