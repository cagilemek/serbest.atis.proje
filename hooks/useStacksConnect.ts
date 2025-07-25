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
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@stacks/transactions';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

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
  const contractAddress = 'STCJX4KMTAYFH35QN4YXYXNT78KHA5VMYYN3XDF3';
  const contractName = "basketball-game";

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
        name: 'Basketball Free Throw Game',
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

      const userAddress = userData.profile.stxAddress.testnet;

      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'start-game',
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardSTXPostCondition(
            userAddress,
            FungibleConditionCode.LessEqual,
            0n
          )
        ],
        onFinish: (data) => {
          console.log('Game started:', data);
          setTimeout(() => fetchGameState(), 3000); // Wait for transaction to be mined
        },
        onCancel: () => {
          console.log('Transaction cancelled');
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Error starting game:', error);
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

      const userAddress = userData.profile.stxAddress.testnet;

      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'take-shots',
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardSTXPostCondition(
            userAddress,
            FungibleConditionCode.LessEqual,
            1000000n // Max 1 STX can be received
          )
        ],
        onFinish: (data) => {
          console.log('Shots taken:', data);
          setTimeout(() => fetchGameState(), 3000); // Wait for transaction to be mined
        },
        onCancel: () => {
          console.log('Transaction cancelled');
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
      const userAddress = userData.profile.stxAddress.testnet;

      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName: 'reset-game',
        functionArgs: [],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardSTXPostCondition(
            userAddress,
            FungibleConditionCode.LessEqual,
            0n
          )
        ],
        onFinish: (data) => {
          console.log('Game reset:', data);
          setTimeout(() => fetchGameState(), 2000);
        },
        onCancel: () => {
          console.log('Transaction cancelled');
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

    if (DEMO_MODE) {
      // Demo mode - use local state
      setGameState(demoGameState);
      return;
    }

    try {
      const userAddress = userData.profile.stxAddress.testnet;

      // Get game data
      const gameResult = await callReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        functionName: 'get-game',
        functionArgs: [principalCV(userAddress)],
        senderAddress: userAddress,
      });

      // Get balance
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
        // No game found, set empty state
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
      // Set default state on error
      setGameState({
        predictions: [],
        shots: [],
        completed: false,
        predictionsMatched: false,
        balance: 0,
      });
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
    userAddress: userData?.profile?.stxAddress?.testnet || null,
  };
}
