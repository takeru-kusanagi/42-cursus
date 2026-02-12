/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   move.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 19:52:53 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 19:53:05 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

int	can_move_at(const t_world *world, double new_x, double new_y)
{
	int	map_x;
	int	map_y;

	map_x = (int)new_x;
	map_y = (int)new_y;
	if (map_x < 0 || map_y < 0 || map_y >= world->h || map_x >= world->w)
		return (0);
	if (world->map[map_y][map_x] == '1' || world->map[map_y][map_x] == ' ')
		return (0);
	return (1);
}

static void	move_forward_back(t_game *game, double step)
{
	double	new_x;
	double	new_y;

	new_x = game->pos_x + game->dir_x * step;
	new_y = game->pos_y + game->dir_y * step;
	if (can_move_at(&game->world, new_x, game->pos_y))
		game->pos_x = new_x;
	if (can_move_at(&game->world, game->pos_x, new_y))
		game->pos_y = new_y;
}

static void	move_left_right(t_game *game, double step)
{
	double	new_x;
	double	new_y;

	new_x = game->pos_x + game->dir_y * step;
	new_y = game->pos_y - game->dir_x * step;
	if (can_move_at(&game->world, new_x, game->pos_y))
		game->pos_x = new_x;
	if (can_move_at(&game->world, game->pos_x, new_y))
		game->pos_y = new_y;
}

void	update_move(t_game *game, double dt)
{
	double	step;

	step = game->move_speed * dt;
	if (game->key_w)
		move_forward_back(game, step);
	if (game->key_s)
		move_forward_back(game, -step);
	if (game->key_a)
		move_left_right(game, step);
	if (game->key_d)
		move_left_right(game, -step);
}
