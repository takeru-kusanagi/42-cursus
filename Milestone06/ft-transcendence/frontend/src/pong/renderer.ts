/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   renderer.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ccolin <clmnt.co@gmail.com>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/01 13:52:05 by ccolin            #+#    #+#             */
/*   Updated: 2026/03/16 18:35:52 by ccolin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { WORLD_WIDTH, WORLD_HEIGHT } from "@shared/pong/settings"
import type { GameState } from "@shared/pong/types"
import { BALL_SIZE, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_WALL_DISTANCE } from '@shared/pong/settings';
import { DARK_BLUE, DARK_PINK, BRIGHT_PINK, WHITE } from './style.js';

export class Renderer {
  private ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error("Canvas element is not provided")
    }

    canvas.width = WORLD_WIDTH
    canvas.height = WORLD_HEIGHT

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("Could not get 2D rendering context")
    }

    this.ctx = ctx
  }

  clear() {
    this.ctx.fillStyle = DARK_BLUE
    this.ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

    this.ctx.strokeStyle = DARK_PINK
    this.ctx.setLineDash([10, 10])
    this.ctx.beginPath()
    this.ctx.moveTo(WORLD_WIDTH / 2, 0)
    this.ctx.lineTo(WORLD_WIDTH / 2, WORLD_HEIGHT)
    this.ctx.stroke()
    this.ctx.setLineDash([])
  }

  render(state: GameState) {
    this.clear()

    // Ball
    this.ctx.fillStyle = BRIGHT_PINK
    this.ctx.fillRect(
      state.ball.x - BALL_SIZE / 2,
      state.ball.y - BALL_SIZE / 2,
      BALL_SIZE,
      BALL_SIZE
    )

    // Left paddle
    this.ctx.fillRect(
      PADDLE_WALL_DISTANCE,
      state.paddles.p1.y - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    )

    // Right paddle
    this.ctx.fillRect(
      WORLD_WIDTH - PADDLE_WALL_DISTANCE - PADDLE_WIDTH,
      state.paddles.p2.y - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    )

    // Countdown
    if (state.countdownActive) {
      this.ctx.fillStyle = WHITE
      this.ctx.font = "64px 'Lucida Console', monospace"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"

      const number = Math.ceil(state.countdown)
      const offsetY = 64

      this.ctx.fillText(
        number.toString(),
        WORLD_WIDTH / 2,
        WORLD_HEIGHT / 2 - offsetY
      )
    }

    if (state.status === 'finished' && state.winner) {
      this.ctx.fillStyle = 'rgba(15, 18, 25, 0.72)'
      this.ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
      this.ctx.fillStyle = WHITE
      this.ctx.font = "42px 'Lucida Console', monospace"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      this.ctx.fillText(
        `${state.winner === 'p1' ? 'P1' : 'P2'} WINS`,
        WORLD_WIDTH / 2,
        WORLD_HEIGHT / 2
      )
    }
  }
}
