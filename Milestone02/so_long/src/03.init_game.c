/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   03.init_game.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/03 19:16:15 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/07 18:14:47 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	load_images2(t_game *game, char **map)
{
	game->img_exit = mlx_xpm_file_to_image(game->mlx, "textures/exit.xpm",
			&game->img_size, &game->img_size);
	if (!game->img_exit)
	{
		free_map(map);
		exit_error("Error: Failed to load exit image.");
	}
	game->img_collect = mlx_xpm_file_to_image(game->mlx, "textures/collect.xpm",
			&game->img_size, &game->img_size);
	if (!game->img_collect)
	{
		free_map(map);
		exit_error("Error: Failed to load collect image.");
	}
}

void	load_images1(t_game *game, char **map)
{
	game->img_wall = mlx_xpm_file_to_image(game->mlx, "textures/wall.xpm",
			&game->img_size, &game->img_size);
	if (!game->img_wall)
	{
		free_map(map);
		exit_error("Error: Failed to load wall image.");
	}
	game->img_floor = mlx_xpm_file_to_image(game->mlx, "textures/floor.xpm",
			&game->img_size, &game->img_size);
	if (!game->img_floor)
	{
		free_map(map);
		exit_error("Error: Failed to load floor image.");
	}
	game->img_player = mlx_xpm_file_to_image(game->mlx, "textures/player1.xpm",
			&game->img_size, &game->img_size);
	if (!game->img_player)
	{
		free_map(map);
		exit_error("Error: Failed to load player image.");
	}
}

void	initialize_game(t_game *game, char **map)
{
	game->move_count = 0;
	game->mlx = mlx_init();
	if (!game->mlx)
	{
		free_map(map);
		exit_error("Error: Failed to initialize MinilibX.");
	}
	game->img_size = 64;
	game->map = map;
	game->map_height = get_line_count(map);
	game->map_width = get_line_length(map[0]);
	game->collect_count = 0;
	load_images1(game, map);
	load_images2(game, map);
}

void	init_game(t_game *game, char **map)
{
	int	i;
	int	j;

	i = 0;
	initialize_game(game, map);
	while (game->map[i])
	{
		j = 0;
		while (game->map[i][j] && game->map[i][j] != '\n')
		{
			if (game->map[i][j] == 'P')
			{
				game->player_x = j;
				game->player_y = i;
			}
			else if (game->map[i][j] == 'C')
				game->collect_count++;
			j++;
		}
		i++;
	}
}
