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
  StacksMainnet,
} from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
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

  const network = new StacksTestnet(); // Change to StacksMainnet for production
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Update with your deployed contract address
  const contractName = 'basketball-game';

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
        name: 'Serbest Atış Projesi',
        icon: '/basketball-icon.png',
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
    if (!userData) return;

    setIsLoading(true);
    try {
      const functionArgs = [
        listCV(predictions.map(p => boolCV(p)))
      ];

      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'start-game',
        functionArgs,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('Game started:', data);
          fetchGameState();
        },
      });
    } catch (error) {
      console.error('Error starting game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const takeShots = async (shots: boolean[]) => {
    if (!userData) return;

    setIsLoading(true);
    try {
      const functionArgs = [
        listCV(shots.map(s => boolCV(s)))
      ];

      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'take-shots',
        functionArgs,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('Shots taken:', data);
          fetchGameState();
        },
      });
    } catch (error) {
      console.error('Error taking shots:', error);
    } finally {
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
          fetchGameState();
        },
      });
    } catch (error) {
      console.error('Error resetting game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGameState = async () => {
    if (!userData) return;

    try {
      const result = await callReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        functionName: 'get-game-stats',
        functionArgs: [principalCV(userData.profile.stxAddress.testnet)],
        senderAddress: userData.profile.stxAddress.testnet,
      });

      const gameData = cvToJSON(result);
      if (gameData.success && gameData.value) {
        const data = gameData.value;
        setGameState({
          predictions: data.predictions?.value?.map((p: any) => p.value) || [],
          shots: data.shots?.value?.map((s: any) => s.value) || [],
          completed: data.completed?.value || false,
          predictionsMatched: data['predictions-matched']?.value || false,
          balance: Number(data.balance?.value) || 0,
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
  };
}