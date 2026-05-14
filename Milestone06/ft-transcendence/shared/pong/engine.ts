
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_SIZE,
  PADDLE_SPEED,
  AI_PADDLE_SPEED,
  BALL_SPEED,
  PADDLE_WALL_DISTANCE, 
  MAX_SCORE
} from "./settings.js";

import type { GameState, InputState, GameMode } from "./types.js"
import { getAiInput } from './ai.js';

const LEFT_PADDLE_RIGHT_EDGE = PADDLE_WALL_DISTANCE + PADDLE_WIDTH / 2;
const RIGHT_PADDLE_LEFT_EDGE = WORLD_WIDTH - PADDLE_WALL_DISTANCE - PADDLE_WIDTH / 2;

export function createInitialState(mode: GameMode): GameState {
  const direction = Math.random() < 0.5 ? -1 : 1;
  return {
    mode: mode,
    status: 'countdown',
    winner: null,
    countdown: 3,
    countdownActive: true,
    ball: {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
      vx: BALL_SPEED * direction,
      vy: 0
    },
    paddles: {
      p1: { y: WORLD_HEIGHT / 2 },
      p2: { y: WORLD_HEIGHT / 2 }
    },
    score: {
      p1: 0,
      p2: 0
    },
    ai: {
    ballIncoming: false,
    aiDecisionMade: false,
    targetY: null,
    reactionThreshold: 0
  }
  }
}

export function getState(inputs: { p1: InputState, p2: InputState }, state: GameState): GameState {
  const newState: GameState = {
    mode: state.mode,
    status: state.status,
    winner: state.winner,
    countdown: state.countdown,
    countdownActive: state.countdownActive,
    ball: { ...state.ball },
    paddles: {
      p1: { ...state.paddles.p1 },
      p2: { ...state.paddles.p2 }
    },
    score: { ...state.score },
    ai: { ...state.ai }
  }

  if (state.status === 'finished') {
    return newState;
  }

  // パドルの移動適用
  updatePaddles(inputs, newState);
  
  // カウントダウン処理
  if (newState.countdownActive) {
    updatecountdown(newState);
    return newState;
  }

  // ゲームプレイ中の移動・衝突判定
  newState.status = 'playing';
  moveBall(newState);
  paddlesCollision(newState);
  return scoring(newState);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function updatePaddles(inputs: { p1: InputState, p2: InputState }, state: GameState): void {
  const AIR_CUSHION = BALL_SIZE;

  if (state.mode === 'singlePlayer') {
    const moveUp = inputs.p1.w || inputs.p1.arrowUp;
    const moveDown = inputs.p1.s || inputs.p1.arrowDown;
    if (moveUp) state.paddles.p1.y -= PADDLE_SPEED;
    if (moveDown) state.paddles.p1.y += PADDLE_SPEED;

    const aiInput = getAiInput(state);
    if (aiInput.arrowUp) state.paddles.p2.y -= AI_PADDLE_SPEED;
    if (aiInput.arrowDown) state.paddles.p2.y += AI_PADDLE_SPEED;
  } else {
    // オンライン/ローカルマルチプレイヤー
    if (inputs.p1.w || inputs.p1.arrowUp) state.paddles.p1.y -= PADDLE_SPEED;
    if (inputs.p1.s || inputs.p1.arrowDown) state.paddles.p1.y += PADDLE_SPEED;
    if (inputs.p2.w || inputs.p2.arrowUp) state.paddles.p2.y -= PADDLE_SPEED;
    if (inputs.p2.s || inputs.p2.arrowDown) state.paddles.p2.y += PADDLE_SPEED;
  }

  const minY = PADDLE_HEIGHT / 2 + AIR_CUSHION;
  const maxY = WORLD_HEIGHT - PADDLE_HEIGHT / 2 - AIR_CUSHION;

  state.paddles.p1.y = clamp(state.paddles.p1.y, minY, maxY);
  state.paddles.p2.y = clamp(state.paddles.p2.y, minY, maxY);
}

function updatecountdown(state: GameState) {
  state.countdown -= 2 / 60;
  if (state.countdown <= 0) {
    state.countdown = 0;
    state.countdownActive = false;
    state.status = 'playing';
  }
}

function moveBall(newState: GameState): void {
  newState.ball.x += newState.ball.vx;
  newState.ball.y += newState.ball.vy;

  if (newState.ball.y - BALL_SIZE / 2 <= 0 || newState.ball.y + BALL_SIZE / 2 >= WORLD_HEIGHT)
    newState.ball.vy *= -1;
}

function paddlesCollision(newState: GameState): void {
  const ballLeft = newState.ball.x - BALL_SIZE / 2;
  const ballRight = newState.ball.x + BALL_SIZE / 2;
  const ballTop = newState.ball.y - BALL_SIZE / 2;
  const ballBottom = newState.ball.y + BALL_SIZE / 2;
  const ballCenterY = newState.ball.y;

  const MAX_ANGLE = Math.PI / 4;
  const speed = Math.hypot(newState.ball.vx, newState.ball.vy);

  const p1Top = newState.paddles.p1.y - PADDLE_HEIGHT / 2;
  const p1Bottom = newState.paddles.p1.y + PADDLE_HEIGHT / 2;
  if (ballLeft <= LEFT_PADDLE_RIGHT_EDGE && ballBottom >= p1Top && ballTop <= p1Bottom) {
    let relativeY = (ballCenterY - newState.paddles.p1.y) / (PADDLE_HEIGHT / 2);
    relativeY = Math.max(-1, Math.min(1, relativeY));
    const angle = relativeY * MAX_ANGLE;
    newState.ball.vx = speed * Math.cos(angle);
    newState.ball.vy = speed * Math.sin(angle);
    newState.ball.x = LEFT_PADDLE_RIGHT_EDGE + BALL_SIZE / 2;
  }

  const p2Top = newState.paddles.p2.y - PADDLE_HEIGHT / 2;
  const p2Bottom = newState.paddles.p2.y + PADDLE_HEIGHT / 2;
  if (ballRight >= RIGHT_PADDLE_LEFT_EDGE && ballBottom >= p2Top && ballTop <= p2Bottom) {
    let relativeY = (ballCenterY - newState.paddles.p2.y) / (PADDLE_HEIGHT / 2);
    relativeY = Math.max(-1, Math.min(1, relativeY));
    const angle = relativeY * MAX_ANGLE;
    newState.ball.vx = -speed * Math.cos(angle);
    newState.ball.vy = speed * Math.sin(angle);
    newState.ball.x = RIGHT_PADDLE_LEFT_EDGE - BALL_SIZE / 2;
  }
}

function scoring(newState: GameState) : GameState {
  if (newState.ball.x < 0) {
    newState.score.p2 += 1;
    resetBall(newState);
  } else if (newState.ball.x > WORLD_WIDTH) {
    newState.score.p1 += 1;
    resetBall(newState);
  }

  if (newState.score.p1 === MAX_SCORE || newState.score.p2 === MAX_SCORE) {
    newState.status = 'finished';
    newState.winner = newState.score.p1 === MAX_SCORE ? 'p1' : 'p2';
    newState.countdownActive = false;
    newState.ball.vx = 0;
    newState.ball.vy = 0;
  }
  return newState;
}

function resetBall(newState: GameState) {
  const direction = Math.random() < 0.5 ? -1 : 1;
  newState.ball.x = WORLD_WIDTH / 2;
  newState.ball.y = WORLD_HEIGHT / 2;
  newState.ball.vx = BALL_SPEED * direction;
  newState.ball.vy = 0;
  newState.countdown = 3;
  newState.countdownActive = true;
  newState.status = 'countdown';
}