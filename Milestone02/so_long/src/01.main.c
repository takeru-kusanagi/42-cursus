/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   01.main.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/30 21:15:48 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/04 20:35:12 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

int	get_line_count(char **map)
{
	int	i;

	i = 0;
	while (map[i])
		i++;
	return (i);
}

int	get_line_length(char *line)
{
	int	len;

	len = 0;
	while (line[len] && line[len] != '\n')
		len++;
	return (len);
}

int	main(void)
{
	t_game	game;
	char	**map;

	map = read_map("maps/map.ber");
	if (!map)
		exit_error("Error: Failed to read map file or map is empty");
	game.map = map;
	validate_map(&game);
	init_game(&game, map);
	validate_path(&game);
	game.win = mlx_new_window(game.mlx, get_line_length(map[0]) * 64,
			get_line_count(map) * 64, "Penguin Adventure");
	draw_map(&game);
	mlx_key_hook(game.win, key_press, &game);
	mlx_hook(game.win, 17, 0, (void *)exit_game, &game);
	mlx_loop(game.mlx);
	exit_game(&game);
	free_map(map);
	return (0);
}
