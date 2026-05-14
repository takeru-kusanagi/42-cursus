/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   input.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ccolin <clmnt.co@gmail.com>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/01 15:37:14 by ccolin            #+#    #+#             */
/*   Updated: 2026/03/16 18:35:50 by ccolin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import type { InputState } from "@shared/pong/types"

let keys: Record<string, boolean> = {}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true
})

window.addEventListener("keyup", (e) => {
  keys[e.key] = false
})

export function getInputState(): InputState {
  const input: InputState = {
    w: !!(keys["w"] || keys["W"]),
    s: !!(keys["s"] || keys["S"]),
    arrowUp: !!keys["ArrowUp"],
    arrowDown: !!keys["ArrowDown"],
  }

  return input
}
