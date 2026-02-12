/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   draw_map.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/01 19:28:32 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/01 19:28:32 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	put_image(t_game *game, void *img, int x, int y)
{
	mlx_put_image_to_window(game->mlx, game->win, img, x * game->img_size, y
		* game->img_size);
}

void	draw_map(t_game *game)
{
	int	i;
	int	j;

	i = 0;
	while (game->map[i])
	{
		j = 0;
		while (game->map[i][j] && game->map[i][j] != '\n')
		{
			put_image(game, game->img_floor, j, i);
			if (game->map[i][j] == '1')
				put_image(game, game->img_wall, j, i);
			else if (game->map[i][j] == 'P')
				put_image(game, game->img_player, j, i);
			else if (game->map[i][j] == 'E')
				put_image(game, game->img_exit, j, i);
			else if (game->map[i][j] == 'C')
				put_image(game, game->img_collect, j, i);
			j++;
		}
		i++;
	}
}
