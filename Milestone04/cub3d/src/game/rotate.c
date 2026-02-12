/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rotate.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+
	+:+     */
/*   By: sykawai <sykawai@student.42tokyo.jp>       +#+  +:+
	+#+        */
/*                                                +#+#+#+#+#+
	+#+           */
/*   Created: 2025/10/23 23:55:46 by sykawai           #+#    #+#             */
/*   Updated: 2025/10/23 23:55:46 by sykawai          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static void	rotate_vector(double *x, double *y, double angle)
{
	double	old_x;
	double	old_y;

	old_x = *x;
	old_y = *y;
	*x = old_x * cos(angle) - old_y * sin(angle);
	*y = old_x * sin(angle) + old_y * cos(angle);
}

void	update_rotate(t_game *game, double dt)
{
	double	angle;

	angle = game->rot_speed * dt;
	if (game->key_right)
	{
		rotate_vector(&game->dir_x, &game->dir_y, angle);
		rotate_vector(&game->plane_x, &game->plane_y, angle);
	}
	if (game->key_left)
	{
		rotate_vector(&game->dir_x, &game->dir_y, -angle);
		rotate_vector(&game->plane_x, &game->plane_y, -angle);
	}
}
