/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   04.validate_path2.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/07 18:38:26 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/07 18:44:55 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	flood_fill_collectibles(char **map, int x, int y, t_game *game)
{
	if (x < 0 || y < 0 || x >= game->map_width || y >= game->map_height)
		return ;
	if (map[y][x] == '1' || map[y][x] == 'V' || map[y][x] == 'E')
		return ;
	if (map[y][x] == 'C')
		game->collect_found++;
	map[y][x] = 'V';
	flood_fill_collectibles(map, x + 1, y, game);
	flood_fill_collectibles(map, x - 1, y, game);
	flood_fill_collectibles(map, x, y + 1, game);
	flood_fill_collectibles(map, x, y - 1, game);
}

void	flood_fill_exit(char **map, int x, int y, t_game *game)
{
	if (x < 0 || y < 0 || x >= game->map_width || y >= game->map_height)
		return ;
	if (map[y][x] == '1' || map[y][x] == 'V')
		return ;
	map[y][x] = 'V';
	flood_fill_exit(map, x + 1, y, game);
	flood_fill_exit(map, x - 1, y, game);
	flood_fill_exit(map, x, y + 1, game);
	flood_fill_exit(map, x, y - 1, game);
}
