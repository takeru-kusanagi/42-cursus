import { useEffect, useRef } from "react"
import { getInputState } from "./input.js"
import { Renderer } from "./renderer.js"
import { WORLD_WIDTH, WORLD_HEIGHT, PADDLE_SPEED } from "@shared/pong/settings"
import type { GameState, InputState } from "@shared/pong/types"
import type { Socket } from "socket.io-client"
import { getState, createInitialState } from '@shared/pong/engine';

type PongGameProps = {
  resetKey?: number
  onStateChange?: (state: GameState) => void
  onMatchEnd?: (state: GameState) => void
  mode: 'FRIEND' | 'LOCAL' | 'AI' | null;
  socket: Socket | null; 
  initialState?: GameState | null;
  playerSide?: 'p1' | 'p2';
  gameId?: string;
}

export default function PongGame({ 
  resetKey = 0, 
  onStateChange, 
  onMatchEnd, initialState, playerSide, gameId,
  mode, 
  socket 
}: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stateRef = useRef<GameState | null>(null)

  const hasFinishedRef = useRef(false)

  useEffect(() => {
    hasFinishedRef.current = false;
    // 1. スクロール防止
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = WORLD_WIDTH
    canvas.height = WORLD_HEIGHT

    const renderer = new Renderer(canvas)
    let animationFrame: number

          // 2. 初期状態のセットアップ
    if (mode === 'FRIEND' && initialState) {
      stateRef.current = initialState; // これを追加！
    } else if (mode === 'LOCAL' || mode === 'AI') {
      stateRef.current = createInitialState(mode === 'AI' ? 'singlePlayer' : 'onlineMultiplayer' as any);
    }

    const handleState = (newState: GameState) => {
      // ログを出してデータが届いているか確認！
      console.log("Socket State Received:", newState.status);
      stateRef.current = newState
    }

    if (socket) {
      socket.on("state", handleState);
      // もし Game.tsx から初期 state が渡せるならここでセット、
      // なければサーバーから最初の 'state' が届くのを待つ
    }

    // 2. 初期状態のセットアップ (LOCAL/AI用)
    if (mode === 'LOCAL' || mode === 'AI') {
      stateRef.current = createInitialState(mode === 'AI' ? 'singlePlayer' : 'onlineMultiplayer' as any);
    }

    if (socket) {
      socket.on("state", handleState);
    }

  function gameLoop() {
      let currentState = stateRef.current;
      if (!currentState) {
        animationFrame = requestAnimationFrame(gameLoop);
        return;
      }

      if (socket && mode === 'FRIEND') {
        const inputState = getInputState();
        
        // ★サーバー側の handleInput が期待する形式に合わせて送る
        socket.emit("input", { 
          gameId: gameId, 
          input: inputState,
          side: playerSide // 自分がどちらか送る
        });

        // 予測レンダリング（自分のパドルだけ動かす）
        if (currentState.status === "playing") {
          const speed = PADDLE_SPEED;
          const targetPaddle = playerSide === 'p2' ? currentState.paddles.p2 : currentState.paddles.p1;
          
          if (inputState.w || inputState.arrowUp) targetPaddle.y -= speed;
          if (inputState.s || inputState.arrowDown) targetPaddle.y += speed;
          targetPaddle.y = Math.max(50, Math.min(targetPaddle.y, WORLD_HEIGHT - 50));
        }
      }
      
      // --- 2. ローカル / AI戦 のロジック ---
      else if ((mode === 'LOCAL' || mode === 'AI')) {
        if (currentState.status !== 'finished') {
          const input = getInputState();
          const inputs = {
            p1: { w: input.w, s: input.s, arrowUp: false, arrowDown: false } as InputState,
            p2: mode === 'AI' ? ({} as InputState) : { 
              w: false, s: false, arrowUp: input.arrowUp, arrowDown: input.arrowDown 
            } as InputState
          };

          const nextState = getState(inputs, currentState);
          stateRef.current = nextState;
          currentState = nextState;
          onStateChange?.(nextState);
        }
      }

      // --- 3. 描画 ---
      renderer.render(currentState)

      if (mode === 'FRIEND') {
        onStateChange?.(currentState);
      }
      
      if (currentState.status === "finished") {
        // 🚀 修正：まだ終了処理を呼んでいない時だけ実行
        if (!hasFinishedRef.current) {
          console.log("🏁 Match Finished! Calling onMatchEnd...");
          hasFinishedRef.current = true;
          onMatchEnd?.(currentState);
        }
        return; // ループを止める
      }

      animationFrame = requestAnimationFrame(gameLoop)
    }

    animationFrame = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (socket) socket.off("state", handleState);
      cancelAnimationFrame(animationFrame);
      stateRef.current = null; // リセット時に状態をクリア
    }
  }, [resetKey, mode, socket, initialState, playerSide, gameId]);

  return (
    <canvas
      ref={canvasRef}
      className="block mx-auto w-full h-auto object-contain flex-shrink-0 bg-black"
      style={{
        aspectRatio: "1 / 1",
        maxWidth: `${WORLD_WIDTH}px`,
        maxHeight: `${WORLD_HEIGHT}px`,
      }}
    />
  )
}