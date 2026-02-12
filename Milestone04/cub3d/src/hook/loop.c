/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loop.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/23 18:32:45 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 19:49:04 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static double	get_delta_time(void)
{
	static struct timeval	prev;
	struct timeval			now;
	double					dt;
	static int				is_first_call;
	static double			smooth_dt;

	is_first_call = 1;
	smooth_dt = 1.0 / 60.0;
	gettimeofday(&now, NULL);
	if (!is_first_call)
	{
		dt = (now.tv_sec - prev.tv_sec) + (now.tv_usec - prev.tv_usec)
			/ 1000000.0;
		if (dt > 0.1)
			dt = 0.1;
		smooth_dt = (smooth_dt * 0.9) + (dt * 0.1);
	}
	else
		is_first_call = 0;
	prev = now;
	return (smooth_dt);
}

static void	draw_floor_ceiling(t_game *game)
{
	int				x;
	int				y;
	char			*pixel;
	int				half_height;
	unsigned int	color;

	half_height = game->win_h / 2;
	y = 0;
	while (y < game->win_h)
	{
		if (y < half_height)
			color = game->color_ceil;
		else
			color = game->color_floor;
		x = 0;
		while (x < game->win_w)
		{
			pixel = game->frame.addr + (y * game->frame.line_len) + (x
					* (game->frame.bpp / 8));
			*(unsigned int *)pixel = color;
			x++;
		}
		y++;
	}
}

int	loop_tick(void *param)
{
	t_game	*game;
	double	dt;

	game = (t_game *)param;
	dt = get_delta_time();
	update_move(game, dt);
	update_rotate(game, dt);
	draw_floor_ceiling(game);
	cast_rays(game);
	mlx_put_image_to_window(game->mlx, game->win, game->frame.img, 0, 0);
	return (0);
}
