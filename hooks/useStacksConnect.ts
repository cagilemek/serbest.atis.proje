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

// Demo mode - set to false for real testnet deployment
const DEMO_MODE = false;

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
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const contractName = 'basketball_game';

  // Demo game state for testing
  const [demoGameState, setDemoGameState] = useState<GameState>({
    predictions: [],
    shots: [],
    completed: false,
    predictionsMatched: false,
    balance: 0,
  });

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
        name: 'Free Throw Project',
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
    setDemoGameState({
      predictions: [],
      shots: [],
      completed: false,
      predictionsMatched: false,
      balance: 0,
    });
  };

  const startGame = async (predictions: boolean[]) => {
    if (!userData) return;

    setIsLoading(true);
    
    if (DEMO_MODE) {
      // Demo mode - simulate blockchain interaction
      setTimeout(() => {
        setDemoGameState({
          predictions,
          shots: [],
          completed: false,
          predictionsMatched: false,
          balance: demoGameState.balance,
        });
        setGameState({
          predictions,
          shots: [],
          completed: false,
          predictionsMatched: false,
          balance: demoGameState.balance,
        });
        setIsLoading(false);
        console.log('Demo: Game started with predictions:', predictions);
      }, 1000);
      return;
    }

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
    
    if (DEMO_MODE) {
      // Demo mode - simulate blockchain interaction
      setTimeout(() => {
        const predictionsMatch = JSON.stringify(demoGameState.predictions) === JSON.stringify(shots);
        const newBalance = predictionsMatch ? demoGameState.balance + 1000000 : demoGameState.balance;
        
        const newGameState = {
          predictions: demoGameState.predictions,
          shots,
          completed: true,
          predictionsMatched: predictionsMatch,
          balance: newBalance,
        };
        
        setDemoGameState(newGameState);
        setGameState(newGameState);
        setIsLoading(false);
        
        if (predictionsMatch) {
          console.log('Demo: Perfect predictions! You earned 1 STX token!');
        } else {
          console.log('Demo: Game completed, but predictions didn\'t match.');
        }
      }, 1000);
      return;
    }

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
    
    if (DEMO_MODE) {
      // Demo mode - reset game state
      setTimeout(() => {
        setDemoGameState({
          predictions: [],
          shots: [],
          completed: false,
          predictionsMatched: false,
          balance: demoGameState.balance,
        });
        setGameState({
          predictions: [],
          shots: [],
          completed: false,
          predictionsMatched: false,
          balance: demoGameState.balance,
        });
        setIsLoading(false);
        console.log('Demo: Game reset!');
      }, 500);
      return;
    }

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

    if (DEMO_MODE) {
      // Demo mode - use local state
      setGameState(demoGameState);
      return;
    }

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
      if (DEMO_MODE) {
        setGameState(demoGameState);
      } else {
        fetchGameState();
      }
    }
  }, [userData, demoGameState]);

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