;; Basketball Free Throw Game Smart Contract
;; Players make 3 predictions, then take 3 shots
;; If predictions match actual results, they earn tokens

;; Define constants
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_GAME_NOT_FOUND (err u101))
(define-constant ERR_GAME_ALREADY_EXISTS (err u102))
(define-constant ERR_INVALID_SHOT_COUNT (err u103))
(define-constant ERR_PREDICTIONS_NOT_SET (err u104))
(define-constant ERR_SHOTS_ALREADY_TAKEN (err u105))
(define-constant ERR_INSUFFICIENT_BALANCE (err u106))

;; Define token reward amount (in microSTX)
(define-constant REWARD_AMOUNT u1000000) ;; 1 STX

;; Game state data structure
(define-map games
  { player: principal }
  {
    predictions: (list 3 bool),
    shots: (list 3 bool),
    completed: bool,
    reward-claimed: bool
  }
)

;; Token balance tracking
(define-map token-balances
  { player: principal }
  { balance: uint }
)

;; Contract owner
(define-data-var contract-owner principal tx-sender)

;; Get game state for a player
(define-read-only (get-game (player principal))
  (map-get? games { player: player })
)

;; Get token balance for a player
(define-read-only (get-balance (player principal))
  (default-to u0 (get balance (map-get? token-balances { player: player })))
)

;; Check if predictions match shots
(define-read-only (check-predictions-match (predictions (list 3 bool)) (shots (list 3 bool)))
  (is-eq predictions shots)
)

;; Start a new game with predictions
(define-public (start-game (predictions (list 3 bool)))
  (let ((player tx-sender))
    (asserts! (is-none (map-get? games { player: player })) ERR_GAME_ALREADY_EXISTS)
    (asserts! (is-eq (len predictions) u3) ERR_INVALID_SHOT_COUNT)
    (map-set games
      { player: player }
      {
        predictions: predictions,
        shots: (list),
        completed: false,
        reward-claimed: false
      }
    )
    (ok "Game started! Make your 3 shots now.")
  )
)

;; Take shots (must be exactly 3 shots)
(define-public (take-shots (shots (list 3 bool)))
  (let (
    (player tx-sender)
    (game-data (unwrap! (map-get? games { player: player }) ERR_GAME_NOT_FOUND))
  )
    (asserts! (is-eq (len shots) u3) ERR_INVALID_SHOT_COUNT)
    (asserts! (not (get completed game-data)) ERR_SHOTS_ALREADY_TAKEN)
    
    (let (
      (predictions (get predictions game-data))
      (predictions-match (check-predictions-match predictions shots))
      (current-balance (get-balance player))
    )
      ;; Update game state
      (map-set games
        { player: player }
        {
          predictions: predictions,
          shots: shots,
          completed: true,
          reward-claimed: false
        }
      )
      
      ;; Award tokens if predictions match
      (if predictions-match
        (begin
          (map-set token-balances
            { player: player }
            { balance: (+ current-balance REWARD_AMOUNT) }
          )
          (ok "Perfect predictions! You earned 1 STX token!")
        )
        (ok "Game completed, but predictions didn't match. Better luck next time!")
      )
    )
  )
)

;; Reset game for a player (allows playing again)
(define-public (reset-game)
  (let ((player tx-sender))
    (map-delete games { player: player })
    (ok "Game reset! You can start a new game.")
  )
)

;; Admin function to add tokens to contract (for rewards)
(define-public (fund-contract (amount uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_NOT_AUTHORIZED)
    (ok "Contract funded")
  )
)

;; Get game statistics
(define-read-only (get-game-stats (player principal))
  (match (map-get? games { player: player })
    game-data {
      predictions: (get predictions game-data),
      shots: (get shots game-data),
      completed: (get completed game-data),
      predictions-matched: (if (get completed game-data)
        (check-predictions-match (get predictions game-data) (get shots game-data))
        false
      ),
      balance: (get-balance player)
    }
    {
      predictions: (list),
      shots: (list),
      completed: false,
      predictions-matched: false,
      balance: (get-balance player)
    }
  )
)
