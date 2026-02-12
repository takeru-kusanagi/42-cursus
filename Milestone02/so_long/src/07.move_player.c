/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   07.move_player.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/01 19:30:02 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/07 17:59:35 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

int	whats_on_the_next_cell(t_game *game, int new_y, int new_x)
{
	if (game->map[new_y][new_x] == '1')
		return (0);
	if (game->map[new_y][new_x] == 'C')
	{
		game->collect_count--;
		game->map[new_y][new_x] = '0';
	}
	if (game->map[new_y][new_x] == 'E' && game->collect_count == 0)
	{
		ft_printf("congratulations! You win!\n");
		mlx_loop_end(game->mlx);
		return (2);
	}
	else if (game->map[new_y][new_x] == 'E' && game->collect_count != 0)
		return (0);
	return (1);
}

void	move_player(t_game *game, int dx, int dy)
{
	int	new_x;
	int	new_y;
	int	action_res;

	new_y = game->player_y + dy;
	new_x = game->player_x + dx;
	action_res = whats_on_the_next_cell(game, new_y, new_x);
	if (action_res == 0 || action_res == 2)
		return ;
	game->move_count++;
	ft_printf("Moves: %d\n", game->move_count);
	game->map[game->player_y][game->player_x] = '0';
	game->map[new_y][new_x] = 'P';
	game->player_x = new_x;
	game->player_y = new_y;
	draw_map(game);
}
