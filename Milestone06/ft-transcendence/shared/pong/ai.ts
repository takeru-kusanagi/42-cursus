import type { GameState, InputState } from "./types.js";
import { PADDLE_HEIGHT, WORLD_HEIGHT, WORLD_WIDTH, PADDLE_WALL_DISTANCE } from "./settings.js";

const REACTION_MIN = 20; // 35%Expand commentComment on line R17Resolved
const REACTION_MAX = 40; // 60%
const ERROR_PERCENT = 0.15; 

function pickReactionThreshold(): number {
  const percent = REACTION_MIN + Math.random() * (REACTION_MAX - REACTION_MIN);
  return (percent / 100) * WORLD_WIDTH;
}

// Predict Y deterministically, without error
function predictBallY(ball: { x: number; y: number; vx: number; vy: number }, paddleX: number): number {
  const { x, y, vx, vy } = ball;
  if (vx <= 0) return y; // ball moving away

  let predictedY = y + vy * ((paddleX - x) / vx);

  // Reflect off walls
  while (predictedY < 0 || predictedY > WORLD_HEIGHT) {
    if (predictedY < 0) predictedY = -predictedY;
    if (predictedY > WORLD_HEIGHT) predictedY = 2 * WORLD_HEIGHT - predictedY;
  }

  return predictedY;
}

export function getAiInput(state: GameState): InputState {
  const out: InputState = { w: false, s: false, arrowUp: false, arrowDown: false };
  const { ball, paddles } = state;
  const aiY = paddles.p2.y;
  const aiX = WORLD_WIDTH - PADDLE_WALL_DISTANCE;

  if (state.countdownActive || state.status !== 'playing') {
    state.ai.ballIncoming = false;
    state.ai.aiDecisionMade = false;
    state.ai.targetY = null;
    state.ai.reactionThreshold = 0;
    return out;
  }
  
  if (ball.vx > 0) {
    if (!state.ai.ballIncoming) {
      state.ai.ballIncoming = true;
      state.ai.aiDecisionMade = false;
      state.ai.targetY = null;
      state.ai.reactionThreshold = pickReactionThreshold();
    }

    // Decide target once the ball passes the reaction threshold
    if (!state.ai.aiDecisionMade && ball.x >= state.ai.reactionThreshold) {
      const predicted = predictBallY(ball, aiX);

      // Apply random error
      const maxError = PADDLE_HEIGHT * ERROR_PERCENT;
      const error = (Math.random() * 2 - 1) * maxError;
      state.ai.targetY = Math.max(0, Math.min(WORLD_HEIGHT, predicted + error));

      state.ai.aiDecisionMade = true;
    }

    // Move paddle toward state.ai.targetY
    if (state.ai.targetY !== null) {
      const diff = state.ai.targetY - aiY;
      const DEADZONE = PADDLE_HEIGHT * 0.2;

      if (diff > DEADZONE) {
        out.arrowDown = true;
        out.arrowUp = false;
      } else if (diff < -DEADZONE) {
        out.arrowUp = true;
        out.arrowDown = false;
      } else {
        // close enough, stop moving
        out.arrowUp = false;
        out.arrowDown = false;
      }
    }
  } else {
    // Ball moving away, reset memory
    state.ai.ballIncoming = false;
    state.ai.aiDecisionMade = false;
    state.ai.targetY = null;
    state.ai.reactionThreshold = 0;
  }

  return out;
}
