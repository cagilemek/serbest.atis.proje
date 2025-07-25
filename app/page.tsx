'use client';

import React, { useState, useEffect } from 'react';
import { useStacksConnect } from '../hooks/useStacksConnect';
import PredictionPanel from '../components/PredictionPanel';
import ShotPanel from '../components/ShotPanel';
import GameStats from '../components/GameStats';

export default function Home() {
  const {
    userData,
    isLoading,
    gameState,
    connectWallet,
    disconnectWallet,
    startGame,
    takeShots,
    resetGame,
    isConnected,
  } = useStacksConnect();

  const [localPredictions, setLocalPredictions] = useState<boolean[]>([]);
  const [localShots, setLocalShots] = useState<boolean[]>([]);
  const [gamePhase, setGamePhase] = useState<'prediction' | 'shooting' | 'completed'>('prediction');

  // Reset local state when game state changes
  useEffect(() => {
    if (!gameState || gameState.predictions.length === 0) {
      setLocalPredictions([]);
      setLocalShots([]);
      setGamePhase('prediction');
    } else if (gameState.predictions.length > 0 && !gameState.completed) {
      setLocalPredictions(gameState.predictions);
      setLocalShots(gameState.shots);
      setGamePhase('shooting');
    } else if (gameState.completed) {
      setLocalPredictions(gameState.predictions);
      setLocalShots(gameState.shots);
      setGamePhase('completed');
    }
  }, [gameState]);

  const handlePredictionChange = (index: number, value: boolean) => {
    const newPredictions = [...localPredictions];
    newPredictions[index] = value;
    setLocalPredictions(newPredictions);
  };

  const handleStartGame = async () => {
    if (localPredictions.length === 3 && localPredictions.every(p => p !== undefined)) {
      await startGame(localPredictions);
    }
  };

  const handleShotTaken = (index: number, result: boolean) => {
    const newShots = [...localShots];
    newShots[index] = result;
    setLocalShots(newShots);
  };

  const handleSubmitShots = async () => {
    if (localShots.length === 3 && localShots.every(s => s !== undefined)) {
      await takeShots(localShots);
    }
  };

  const handleResetGame = async () => {
    await resetGame();
  };

  const allPredictionsMade = localPredictions.length === 3 && localPredictions.every(p => p !== undefined);
  const allShotsTaken = localShots.length === 3 && localShots.every(s => s !== undefined);
  const currentShotIndex = localShots.filter(s => s !== undefined).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🏀 Free Throw Project</h1>
              <p className="text-orange-100 mt-1">
                Predict, shoot, earn tokens!
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-orange-100">Connected:</p>
                    <p className="font-mono text-sm">
                      {userData?.profile?.stxAddress?.testnet?.slice(0, 8)}...
                    </p>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="px-6 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  🔗 Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🏀</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome!
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Welcome to the Free Throw Project! In this game, you'll make 3 shot predictions, 
              then perform your actual shots. If your predictions perfectly match 
              your shots, you'll earn STX tokens!
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h3 className="font-bold">Connect Your Wallet</h3>
                  <p className="text-sm text-gray-600">Connect with Hiro Wallet or Xverse</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h3 className="font-bold">Make Your Predictions</h3>
                  <p className="text-sm text-gray-600">Choose which shots you think will be successful</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h3 className="font-bold">Take Your Shots</h3>
                  <p className="text-sm text-gray-600">Enter your actual shot results</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <h3 className="font-bold">Earn Tokens!</h3>
                  <p className="text-sm text-gray-600">Earn 1 STX token if predictions are correct</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Game Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Predictions */}
              <div className="space-y-6">
                <PredictionPanel
                  predictions={localPredictions}
                  onPredictionChange={handlePredictionChange}
                  disabled={gamePhase !== 'prediction' || isLoading}
                />
                
                {gamePhase === 'prediction' && (
                  <div className="text-center">
                    <button
                      onClick={handleStartGame}
                      disabled={!allPredictionsMade || isLoading}
                      className="w-full px-6 py-4 bg-orange-500 text-white rounded-lg font-bold text-lg hover:bg-orange-600 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? '⏳ Starting...' : '🚀 Start Game'}
                    </button>
                  </div>
                )}
              </div>

              {/* Middle Column - Shooting */}
              <div className="space-y-6">
                {gamePhase !== 'prediction' && (
                  <>
                    <ShotPanel
                      shots={localShots}
                      onShotTaken={handleShotTaken}
                      predictions={localPredictions}
                      disabled={isLoading || gamePhase === 'completed'}
                      currentShotIndex={currentShotIndex}
                    />
                    
                    {gamePhase === 'shooting' && allShotsTaken && (
                      <div className="text-center">
                        <button
                          onClick={handleSubmitShots}
                          disabled={isLoading}
                          className="w-full px-6 py-4 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                          {isLoading ? '⏳ Submitting...' : '📤 Submit Shots'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Column - Stats */}
              <div className="space-y-6">
                <GameStats
                  gameState={gameState}
                  userAddress={userData?.profile?.stxAddress?.testnet}
                />
                
                {gamePhase === 'completed' && (
                  <div className="text-center">
                    <button
                      onClick={handleResetGame}
                      disabled={isLoading}
                      className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? '⏳ Resetting...' : '🔄 New Game'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">🏀 Free Throw Project</h2>
            <p className="text-gray-400 mb-4">
              Basketball free throw prediction game on blockchain
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <h3 className="font-bold mb-2">About the Game</h3>
                <p className="text-sm text-gray-400">
                  Basketball prediction game developed using Stacks blockchain technology. 
                  Make 3 free throw predictions, simulate actual shots, and earn STX tokens!
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Technologies</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Clarity Smart Contracts</li>
                  <li>• Next.js & TypeScript</li>
                  <li>• Stacks Blockchain</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">Keywords</h3>
                <p className="text-sm text-gray-400">
                  blockchain game, basketball prediction, free throw, cryptocurrency game, 
                  web3 basketball, stacks blockchain, bitcoin game, crypto gaming
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-4">
              <p className="text-sm text-gray-500">
                Built with Clarity Smart Contracts & Next.js
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Developer Credit - Fixed Bottom Right */}
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-xs shadow-lg backdrop-blur-sm">
        Created by Çağıl Emek Kurtul.
      </div>
    </div>
  );
}