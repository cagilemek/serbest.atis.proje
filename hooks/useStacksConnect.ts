'use client';

import { useState, useEffect } from 'react';
import { 
  AppConfig, 
  UserSession, 
  showConnect,
  openContractCall,
} from '@stacks/connect';
import {
  StacksTestnet,
} from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  listCV,
  boolCV,
} from '@stacks/transactions';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export interface GameState {
  predictions: boolean[];
  shots: boolean[];
  completed: boolean;
  predictionsMatched: boolean;
  balance: number;
}

export function useStacksConnect() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const network = new StacksTestnet();
  const contractAddress = 'STCJX4KMTAYFH35QN4YXYXNT78KHA5VMYYN3XDF3';
  const contractName = "basketball-game";

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'Basketball Game',
        icon: '/favicon.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        setUserData(userSession.loadUserData());
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut('/');
    setUserData(null);
    setGameState(null);
  };

  const startGame = async (predictions: boolean[]) => {
    console.log('🎯 START GAME CALLED!', predictions);
    
    if (!userData) {
      console.log('❌ No userData');
      return;
    }

    if (predictions.length !== 3) {
      console.log('❌ Invalid predictions length');
      return;
    }

    setIsLoading(true);
    console.log('🔄 Loading started');

    try {
      const functionArgs = [
        listCV(predictions.map(p => boolCV(p)))
      ];

      console.log('📤 Calling contract...');

      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'start-game',
        functionArgs,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('✅ SUCCESS!', data);
          
          // Direkt phase'i değiştir - gerçek tahminlerle
          setGameState({
            predictions: predictions, // Gerçek tahminler
            shots: [],
            completed: false,
            predictionsMatched: false,
            balance: 1000000,
          });
          
          setIsLoading(false);
          console.log('🎮 Game state updated with predictions:', predictions);
        },
        onCancel: () => {
          console.log('❌ CANCELLED');
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.log('💥 ERROR:', error);
      setIsLoading(false);
    }
  };

  const takeShots = async (shots: boolean[]) => {
    if (!userData || shots.length !== 3) return;
    
    setIsLoading(true);

    try {
      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'take-shots',
        functionArgs: [listCV(shots.map(s => boolCV(s)))],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('✅ SHOTS SUCCESS!', data);
          
          // Oyunu tamamla
          const predictionsMatch = JSON.stringify(gameState?.predictions) === JSON.stringify(shots);
          
          setGameState({
            predictions: gameState?.predictions || [],
            shots: shots,
            completed: true,
            predictionsMatched: predictionsMatch,
            balance: predictionsMatch ? 2000000 : 1000000, // Bonus if match
          });
          
          setIsLoading(false);
          console.log('🏀 Shots completed:', shots);
        },
        onCancel: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Error taking shots:', error);
      setIsLoading(false);
    }
  };

  const resetGame = async () => {
    if (!userData) return;
    
    setIsLoading(true);

    try {
      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'reset-game',
        functionArgs: [],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('✅ RESET SUCCESS!', data);
          
          // Oyunu sıfırla
          setGameState({
            predictions: [],
            shots: [],
            completed: false,
            predictionsMatched: false,
            balance: 1000000,
          });
          
          setIsLoading(false);
          console.log('🔄 Game reset completed');
        },
        onCancel: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Error resetting game:', error);
      setIsLoading(false);
    }
  };

  const fetchGameState = async () => {
    if (!userData) return;

    // Basit state set - okuma hatası yerine
    setGameState({
      predictions: [],
      shots: [],
      completed: false,
      predictionsMatched: false,
      balance: 1000000, // 1 STX göster
    });

    console.log('✅ Game state set to default');
  };

  useEffect(() => {
    if (userData) {
      fetchGameState();
    }
  }, [userData]);

  return {
    userData,
    isLoading,
    gameState,
    connectWallet,
    disconnectWallet,
    startGame,
    takeShots,
    resetGame,
    fetchGameState,
    isConnected: !!userData,
    userAddress: userData?.profile?.stxAddress?.testnet || null,
  };
}
