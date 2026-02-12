/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   raycast2.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/24 18:02:07 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 17:01:08 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

void	perform_dda(t_game *game, t_raycast *ray)
{
	while (ray->hit == 0)
	{
		if (ray->side_dist_x < ray->side_dist_y)
		{
			ray->side_dist_x += ray->delta_dist_x;
			ray->map_x += ray->step_x;
			ray->side = 0;
		}
		else
		{
			ray->side_dist_y += ray->delta_dist_y;
			ray->map_y += ray->step_y;
			ray->side = 1;
		}
		if (ray->map_x < 0 || ray->map_y < 0 || ray->map_y >= game->world.h
			|| ray->map_x >= game->world.w)
		{
			ray->hit = 1;
		}
		else if (game->world.map[ray->map_y][ray->map_x] == '1')
		{
			ray->hit = 1;
		}
	}
}

static void	set_texture_index(t_raycast *ray)
{
	if (ray->side == 0)
	{
		if (ray->step_x > 0)
			ray->tex_index = 3;
		else
			ray->tex_index = 2;
	}
	else
	{
		if (ray->step_y > 0)
			ray->tex_index = 1;
		else
			ray->tex_index = 0;
	}
}

void	calculate_distance_and_texture(t_game *game, t_raycast *ray)
{
	int	tex_width;

	tex_width = TEX_SIZE;
	if (ray->side == 0)
		ray->perp_wall_dist = (ray->map_x - game->pos_x + (1 - ray->step_x) / 2)
			/ ray->ray_dir_x;
	else
		ray->perp_wall_dist = (ray->map_y - game->pos_y + (1 - ray->step_y) / 2)
			/ ray->ray_dir_y;
	if (ray->perp_wall_dist < 0.0001)
		ray->perp_wall_dist = 0.0001;
	if (ray->side == 0)
		ray->wall_x = game->pos_y + ray->perp_wall_dist * ray->ray_dir_y;
	else
		ray->wall_x = game->pos_x + ray->perp_wall_dist * ray->ray_dir_x;
	ray->wall_x -= floor(ray->wall_x);
	ray->tex_x = (int)(ray->wall_x * (double)tex_width);
	if (ray->side == 0 && ray->ray_dir_x > 0)
		ray->tex_x = tex_width - ray->tex_x - 1;
	if (ray->side == 1 && ray->ray_dir_y < 0)
		ray->tex_x = tex_width - ray->tex_x - 1;
	set_texture_index(ray);
}
