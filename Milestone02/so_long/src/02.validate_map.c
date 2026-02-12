/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02.validate_map.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/01 21:16:14 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/04 18:13:08 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

void	validate_map2(t_game *game, t_counts *counts)
{
	int	i;
	int	j;

	i = 0;
	while (game->map[i])
	{
		if (get_line_length(game->map[i]) != game->map_width)
		{
			free_map(game->map);
			exit_error("Error: Map is not rectangular");
		}
		j = 0;
		while (game->map[i][j] && game->map[i][j] != '\n')
		{
			check_characters(game->map[i][j], counts, game->map);
			check_border(game, i, j);
			j++;
		}
		i++;
	}
}

void	validate_map(t_game *game)
{
	t_counts	counts;

	game->map_width = get_line_length(game->map[0]);
	game->map_height = get_line_count(game->map);
	counts.player = 0;
	counts.exit = 0;
	counts.collect = 0;
	validate_map2(game, &counts);
	if (counts.player != 1 || counts.exit != 1 || counts.collect < 1)
	{
		free_map(game->map);
		exit_error("Error: Map must have 1P, 1E, and at least 1C");
	}
}
