import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const address3 = accounts.get("wallet_3")!;

describe("Basketball Game Contract Tests", () => {
  it("should start a new game with predictions", () => {
    const predictions = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    const startGameResponse = simnet.callPublicFn(
      "basketball-game",
      "start-game",
      [Cl.list(predictions)],
      address1,
    );
    expect(startGameResponse.result).toBeOk(Cl.stringAscii("Game started! Make your 3 shots now."));
  });

  it("should not allow starting a game when one already exists", () => {
    const predictions = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    
    // Start first game
    simnet.callPublicFn(
      "basketball-game",
      "start-game",
      [Cl.list(predictions)],
      address2,
    );
    
    // Try to start second game (should fail)
    const secondGameResponse = simnet.callPublicFn(
      "basketball-game",
      "start-game",
      [Cl.list(predictions)],
      address2,
    );
    expect(secondGameResponse.result).toBeErr(Cl.uint(102)); // ERR_GAME_ALREADY_EXISTS
  });

  it("should get game state for a player", () => {
    const predictions = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    
    // Start game
    simnet.callPublicFn(
      "basketball-game",
      "start-game",
      [Cl.list(predictions)],
      address3,
    );
    
    // Get game state
    const gameStateResponse = simnet.callReadOnlyFn(
      "basketball-game",
      "get-game",
      [Cl.principal(address3)],
      address3,
    );
    
    expect(gameStateResponse.result).toBeSome(
      Cl.tuple({
        predictions: Cl.list([Cl.bool(true), Cl.bool(false), Cl.bool(true)]),
        shots: Cl.list([]),
        completed: Cl.bool(false),
        "reward-claimed": Cl.bool(false)
      })
    );
  });

  it("should take shots and award tokens for correct predictions", () => {
    const predictions = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    const shots = [Cl.bool(true), Cl.bool(false), Cl.bool(true)]; // Same as predictions
    
    const testAddress = accounts.get("wallet_4")!;
    
    // Start game
    simnet.callPublicFn(
      "basketball-game",
      "start-game",
      [Cl.list(predictions)],
      testAddress,
    );
    
    // Take shots (matching predictions)
    const takeShotsResponse = simnet.callPublicFn(
      "basketball-game",
      "take-shots",
      [Cl.list(shots)],
      testAddress,
    );
    
    expect(takeShotsResponse.result).toBeOk(Cl.stringAscii("Perfect predictions! You earned 1 STX token!"));
    
    // Check balance after successful game
    const balanceResponse = simnet.callReadOnlyFn(
      "basketball-game",
      "get-balance",
      [Cl.principal(testAddress)],
      testAddress,
    );
    
    expect(balanceResponse.result).toBeUint(1000000); // Should have 1 STX
  });

  it("should take shots but not award tokens for incorrect predictions", () => {
    const predictions = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    const shots = [Cl.bool(false), Cl.bool(true), Cl.bool(false)]; // Different from predictions
    
    const testAddress = accounts.get("wallet_5")!;
    
    // Start game
    simnet.callPublicFn(
      "basketball-game",
      "start-game",
      [Cl.list(predictions)],
      testAddress,
    );
    
    // Take shots (not matching predictions)
    const takeShotsResponse = simnet.callPublicFn(
      "basketball-game",
      "take-shots",
      [Cl.list(shots)],
      testAddress,
    );
    
    expect(takeShotsResponse.result).toBeOk(Cl.stringAscii("Game completed, but predictions didn't match. Better luck next time!"));
    
    // Check balance remains 0
    const balanceResponse = simnet.callReadOnlyFn(
      "basketball-game",
      "get-balance",
      [Cl.principal(testAddress)],
      testAddress,
    );
    
    expect(balanceResponse.result).toBeUint(0);
  });

  it("should get player balance", () => {
    // Test with a new address that has no games
    const testAddress = accounts.get("wallet_6")!;
    const balanceResponse = simnet.callReadOnlyFn(
      "basketball-game",
      "get-balance",
      [Cl.principal(testAddress)],
      testAddress,
    );
    
    expect(balanceResponse.result).toBeUint(0); // Should have 0 STX initially
  });

  it("should get game statistics", () => {
    const predictions = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    const shots = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    const testAddress = accounts.get("wallet_7")!;
    
    // Start game
    simnet.callPublicFn(
      "basketball-game",
      "start-game",
      [Cl.list(predictions)],
      testAddress,
    );
    
    // Take shots
    simnet.callPublicFn(
      "basketball-game",
      "take-shots",
      [Cl.list(shots)],
      testAddress,
    );
    
    const statsResponse = simnet.callReadOnlyFn(
      "basketball-game",
      "get-game-stats",
      [Cl.principal(testAddress)],
      testAddress,
    );
    
    expect(statsResponse.result).toBeTuple({
      predictions: Cl.list([Cl.bool(true), Cl.bool(false), Cl.bool(true)]),
      shots: Cl.list([Cl.bool(true), Cl.bool(false), Cl.bool(true)]),
      completed: Cl.bool(true),
      "predictions-matched": Cl.bool(true),
      balance: Cl.uint(1000000)
    });
  });

  it("should reset game", () => {
    const testAddress = accounts.get("wallet_8")!;
    const predictions = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    
    // Start a game first
    simnet.callPublicFn(
      "basketball-game",
      "start-game",
      [Cl.list(predictions)],
      testAddress,
    );
    
    const resetResponse = simnet.callPublicFn(
      "basketball-game",
      "reset-game",
      [],
      testAddress,
    );
    
    expect(resetResponse.result).toBeOk(Cl.stringAscii("Game reset! You can start a new game."));
  });

  it("should check if predictions match shots", () => {
    const predictions = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    const matchingShots = [Cl.bool(true), Cl.bool(false), Cl.bool(true)];
    const nonMatchingShots = [Cl.bool(false), Cl.bool(true), Cl.bool(false)];
    
    // Test matching predictions
    const matchResponse = simnet.callReadOnlyFn(
      "basketball-game",
      "check-predictions-match",
      [Cl.list(predictions), Cl.list(matchingShots)],
      address1,
    );
    expect(matchResponse.result).toBeBool(true);
    
    // Test non-matching predictions
    const noMatchResponse = simnet.callReadOnlyFn(
      "basketball-game",
      "check-predictions-match",
      [Cl.list(predictions), Cl.list(nonMatchingShots)],
      address1,
    );
    expect(noMatchResponse.result).toBeBool(false);
  });
});
