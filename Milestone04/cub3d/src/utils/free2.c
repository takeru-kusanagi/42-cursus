/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   free2.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/29 18:25:37 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/29 18:27:45 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static void	free_mlx_resources(t_game *game)
{
	int	i;

	if (!game || !game->mlx)
		return ;
	if (game->frame.img)
	{
		mlx_destroy_image(game->mlx, game->frame.img);
		game->frame.img = NULL;
	}
	i = 0;
	while (i < 4)
	{
		if (game->textures[i].img)
		{
			mlx_destroy_image(game->mlx, game->textures[i].img);
			game->textures[i].img = NULL;
		}
		i++;
	}
	if (game->win)
	{
		mlx_destroy_window(game->mlx, game->win);
		game->win = NULL;
	}
}

static void	free_mlx_xvar(t_game *game)
{
	void	*mlx_ptr;

	if (!game || !game->mlx)
		return ;
	mlx_destroy_display(game->mlx);
	mlx_ptr = game->mlx;
	game->mlx = NULL;
	free(mlx_ptr);
}

void	free_mlx_data(t_game *game)
{
	if (!game || !game->mlx)
		return ;
	free_mlx_resources(game);
	free_mlx_xvar(game);
}
