/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hook.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+
	+:+     */
/*   By: sykawai <sykawai@student.42tokyo.jp>       +#+  +:+
	+#+        */
/*                                                +#+#+#+#+#+
	+#+           */
/*   Created: 2025/10/23 23:55:51 by sykawai           #+#    #+#             */
/*   Updated: 2025/10/23 23:55:51 by sykawai          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

int	on_keydown(int keycode, t_game *game)
{
	if (keycode == ESC)
		on_close(game);
	else if (keycode == RIGHT)
		game->key_right = 1;
	else if (keycode == LEFT)
		game->key_left = 1;
	else if (keycode == W)
		game->key_w = 1;
	else if (keycode == A)
		game->key_a = 1;
	else if (keycode == S)
		game->key_s = 1;
	else if (keycode == D)
		game->key_d = 1;
	return (0);
}

int	on_keyup(int keycode, t_game *game)
{
	if (keycode == RIGHT)
		game->key_right = 0;
	else if (keycode == LEFT)
		game->key_left = 0;
	else if (keycode == W)
		game->key_w = 0;
	else if (keycode == A)
		game->key_a = 0;
	else if (keycode == S)
		game->key_s = 0;
	else if (keycode == D)
		game->key_d = 0;
	return (0);
}

int	on_close(void *param)
{
	t_game	*game;

	game = (t_game *)param;
	free_mlx_data(game);
	free_params(game->params);
	exit(0);
	return (0);
}

int	install_hooks(t_game *game)
{
	mlx_hook(game->win, KEY_PRESS, KEY_PRESS_MASK, on_keydown, game);
	mlx_hook(game->win, KEY_RELEASE, KEY_RELEASE_MASK, on_keyup, game);
	mlx_hook(game->win, CLOSE_WINDOW, 0, on_close, game);
	mlx_loop_hook(game->mlx, loop_tick, game);
	return (0);
}
