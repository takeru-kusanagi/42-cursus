/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mlx_setup.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 16:39:33 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 19:32:58 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

void	my_mlx_pixel_put(t_img *data, int x, int y, int color)
{
	char	*dst;
	int		offset;

	offset = (y * data->line_len) + (x * (data->bpp / 8));
	dst = data->addr + offset;
	*(unsigned int *)dst = color;
}

static int	image_create(t_game *game, t_img *img, int width, int height)
{
	img->img = mlx_new_image(game->mlx, width, height);
	if (!img->img)
		return (1);
	img->addr = mlx_get_data_addr(img->img, &img->bpp, &img->line_len,
			&img->endian);
	if (!img->addr)
		return (1);
	return (0);
}

static int	win_create(t_game *game, int width, int height, char *title)
{
	game->win_w = width;
	game->win_h = height;
	game->win = mlx_new_window(game->mlx, game->win_w, game->win_h, title);
	if (!game->win)
		return (1);
	return (0);
}

int	mlx_setup(t_game *game)
{
	game->mlx = mlx_init();
	if (!game->mlx)
		return (1);
	if (win_create(game, 800, 600, "Hello cub3s!"))
		return (1);
	if (image_create(game, &game->frame, game->win_w, game->win_h))
		return (1);
	if (load_textures(game))
		return (1);
	return (0);
}
