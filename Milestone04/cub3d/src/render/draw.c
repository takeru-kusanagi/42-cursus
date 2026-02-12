/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   draw.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 16:46:40 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 17:01:52 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static unsigned int	get_tex_color(t_tex *tex, int x, int y)
{
	char	*dst;

	if (x < 0 || x >= tex->width || y < 0 || y >= tex->height)
		return (0x000000);
	dst = tex->addr + (y * tex->line_len + x * (tex->bpp / 8));
	return (*(unsigned int *)dst);
}

static void	calc_draw_params(t_game *game, t_raycast *ray, t_draw_params *p)
{
	p->line_height = (int)(game->win_h / ray->perp_wall_dist);
	p->draw_start = -p->line_height / 2 + game->win_h / 2;
	p->draw_end = p->line_height / 2 + game->win_h / 2;
	if (p->draw_start < 0)
		p->draw_start = 0;
	if (p->draw_end >= game->win_h)
		p->draw_end = game->win_h - 1;
	p->tex = &game->textures[ray->tex_index];
	p->tex_step = (double)p->tex->height / p->line_height;
	p->tex_pos = (p->draw_start - game->win_h / 2 + p->line_height / 2)
		* p->tex_step;
}

static void	draw_ceil_floor(int x, t_game *game, t_draw_params *p)
{
	int	y;

	y = 0;
	while (y < p->draw_start)
	{
		my_mlx_pixel_put(&game->frame, x, y, game->color_ceil);
		y++;
	}
	y = p->draw_end + 1;
	while (y < game->win_h)
	{
		my_mlx_pixel_put(&game->frame, x, y, game->color_floor);
		y++;
	}
}

static void	draw_wall_texture(int x, t_game *game, t_raycast *ray,
		t_draw_params *p)
{
	int				y;
	int				tex_y;
	unsigned int	color;

	y = p->draw_start;
	while (y <= p->draw_end)
	{
		tex_y = (int)p->tex_pos;
		if (tex_y >= p->tex->height)
			tex_y = p->tex->height - 1;
		color = get_tex_color(p->tex, ray->tex_x, tex_y);
		my_mlx_pixel_put(&game->frame, x, y, color);
		p->tex_pos += p->tex_step;
		y++;
	}
}

void	draw_wall_slice(int x, t_game *game, t_raycast *ray)
{
	t_draw_params	p;

	calc_draw_params(game, ray, &p);
	draw_ceil_floor(x, game, &p);
	draw_wall_texture(x, game, ray, &p);
}
