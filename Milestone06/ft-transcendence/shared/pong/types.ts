
export type WinnerSide = 'p1' | 'p2' | null

export type RoundStatus = 'countdown' | 'playing' | 'finished'

export type GameMode = 'singlePlayer' | 'onlineMultiplayerRandom' | 'onlineMultiplayerWithFriend' | 'localMultiplayer'

export type GameState = {
  mode: GameMode
  status: RoundStatus
  winner: WinnerSide
  countdown: number
  countdownActive: boolean
  ball: {
    x: number
    y: number
    vx: number
    vy: number
  }
  paddles: {
    p1: { y: number }
    p2: { y: number }
  }
  score: {
    p1: number
    p2: number
  }
  ai: {
    ballIncoming: boolean
    aiDecisionMade: boolean
    targetY: number | null
    reactionThreshold: number
  }
}

export type InputState = {
  w: boolean
  s: boolean
  arrowUp: boolean
  arrowDown: boolean
}
