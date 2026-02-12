/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02.validate_map_utils.c                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/03 19:15:58 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/04 20:35:26 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

int	is_wall(char c)
{
	if (c == '1')
		return (1);
	return (0);
}

void	check_border(t_game *game, int i, int j)
{
	if (i == 0 || i == game->map_height - 1 || j == 0 || j == game->map_width
		- 1)
	{
		if (!is_wall(game->map[i][j]))
		{
			free_map(game->map);
			exit_error("Error: Map border not enclosed by walls");
		}
	}
}

void	check_characters(char c, t_counts *counts, char **map)
{
	if (c == 'P')
		counts->player++;
	else if (c == 'E')
		counts->exit++;
	else if (c == 'C')
		counts->collect++;
	else if (c != '0' && c != '1')
	{
		free_map(map);
		exit_error("Error: Invalid character in map");
	}
}
