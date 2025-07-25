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
  principalCV,
  callReadOnlyFunction,
  cvToJSON,
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
          setIsLoading(false);
          setTimeout(() => fetchGameState(), 2000);
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
          console.log('Shots taken:', data);
          setIsLoading(false);
          setTimeout(() => fetchGameState(), 2000);
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
          console.log('Game reset:', data);
          setIsLoading(false);
          setTimeout(() => fetchGameState(), 2000);
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

    try {
      const userAddress = userData.profile.stxAddress.testnet;

      const gameResult = await callReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        functionName: 'get-game',
        functionArgs: [principalCV(userAddress)],
        senderAddress: userAddress,
      });

      const balanceResult = await callReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        functionName: 'get-balance',
        functionArgs: [principalCV(userAddress)],
        senderAddress: userAddress,
      });

      const gameData = cvToJSON(gameResult);
      const balanceData = cvToJSON(balanceResult);

      if (gameData.success && gameData.value) {
        const data = gameData.value;
        setGameState({
          predictions: data.predictions?.value?.map((p: any) => p.value) || [],
          shots: data.shots?.value?.map((s: any) => s.value) || [],
          completed: data.completed?.value || false,
          predictionsMatched: data['reward-claimed']?.value || false,
          balance: Number(balanceData.value) || 0,
        });
      } else {
        setGameState({
          predictions: [],
          shots: [],
          completed: false,
          predictionsMatched: false,
          balance: Number(balanceData.value) || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
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
