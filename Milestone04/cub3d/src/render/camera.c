/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   camera.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+
	+:+     */
/*   By: sykawai <sykawai@student.42tokyo.jp>       +#+  +:+
	+#+        */
/*                                                +#+#+#+#+#+
	+#+           */
/*   Created: 2025/10/23 23:56:14 by sykawai           #+#    #+#             */
/*   Updated: 2025/10/23 23:56:14 by sykawai          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static void	set_dir_plane_base(t_game *game, double dir_x, double dir_y,
		double plane_x)
{
	game->dir_x = dir_x;
	game->dir_y = dir_y;
	game->plane_x = plane_x;
	game->plane_y = 0.0;
}

static void	set_dir_plane(t_game *game, char player_direction)
{
	if (player_direction == 'N')
		set_dir_plane_base(game, 0.0, -1.0, 0.66);
	else if (player_direction == 'S')
		set_dir_plane_base(game, 0.0, 1.0, -0.66);
	else if (player_direction == 'E')
	{
		set_dir_plane_base(game, 1.0, 0.0, 0.0);
		game->plane_y = 0.66;
	}
	else if (player_direction == 'W')
	{
		set_dir_plane_base(game, -1.0, 0.0, 0.0);
		game->plane_y = -0.66;
	}
}

void	init_camera(t_game *game, int player_start_x, int player_start_y,
		char player_direction)
{
	game->pos_x = (double)player_start_x + 0.5;
	game->pos_y = (double)player_start_y + 0.5;
	set_dir_plane(game, player_direction);
	game->rot_speed = ROTATE_SPEED;
	game->move_speed = MOVE_SPEED;
}
