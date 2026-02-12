/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   04.validate_path.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/03 19:16:04 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/07 18:54:03 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

char	**copy_map(char **map)
{
	char	**dup_map;
	int		i;

	dup_map = malloc(sizeof(char *) * (get_line_count(map) + 1));
	if (!dup_map)
		return (NULL);
	i = 0;
	while (map[i])
	{
		dup_map[i] = ft_strdup(map[i]);
		if (!dup_map[i])
		{
			while (i > 0)
			{
				i--;
				free(dup_map[i]);
			}
			free(dup_map);
			return (NULL);
		}
		i++;
	}
	dup_map[i] = NULL;
	return (dup_map);
}

static void	check_collectibles(char **map)
{
	int	i;
	int	j;

	i = 0;
	while (map[i])
	{
		j = 0;
		while (map[i][j])
		{
			if (map[i][j] == 'C')
			{
				free_map(map);
				exit_error("Error: unreachable Collectible found");
			}
			j++;
		}
		i++;
	}
}

static void	validate_exit(char **map, t_game *game)
{
	int	i;
	int	j;

	i = 0;
	while (map[i])
	{
		j = 0;
		while (map[i][j])
		{
			if (map[i][j] == 'E')
				flood_fill_exit(map, j, i, game);
			j++;
		}
		i++;
	}
	i = 0;
	while (map[i])
	{
		if (ft_strchr(map[i], 'E'))
		{
			free_map(map);
			exit_error("Error: unreachable Exit found");
		}
		i++;
	}
}

void	validate_path(t_game *game)
{
	char	**map_copy;

	map_copy = copy_map(game->map);
	if (!map_copy)
		exit_error("Error: map copy failed");
	game->collect_found = 0;
	flood_fill_collectibles(map_copy, game->player_x, game->player_y, game);
	check_collectibles(map_copy);
	validate_exit(map_copy, game);
	free_map(map_copy);
}
