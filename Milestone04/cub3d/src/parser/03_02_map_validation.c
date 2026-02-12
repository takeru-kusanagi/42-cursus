/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   03_02_map_validation.c                             :+:      :+:    :+:   */
/*                                                    +:+ +:+
	+:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+
	+#+        */
/*                                                +#+#+#+#+#+
	+#+           */
/*   Created: 2025/10/28 19:38:04 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 21:13:53 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static void	finalize_validation(t_params *p, int has_wall, t_file_data *f_data)
{
	if (p->player_count != 1)
		exit_with_cleanup(f_data, p,
			"Map must contain exactly one starting player position.");
	if (has_wall == 0)
		exit_with_cleanup(f_data, p,
			"Map must contain at least one wall ('1') and be enclosed.");
}

static void	map_cleanup_and_exit(t_params *p, t_file_data *f_data,
		const char *msg)
{
	exit_with_cleanup(f_data, p, msg);
}

static void	check_char_and_player(t_params *p, int y, t_file_data *f_data)
{
	int		x;
	char	c;

	x = 0;
	while (p->map[y][x])
	{
		c = p->map[y][x];
		if (!(c == '0' || c == '1' || c == 'N' || c == 'S' || c == 'W'
				|| c == 'E' || c == ' '))
			map_cleanup_and_exit(p, f_data,
				"Invalid character in map (allowed: 0,1,N,S,W,E,space).");
		if (c == 'N' || c == 'S' || c == 'W' || c == 'E')
		{
			if (p->player_count > 0)
				map_cleanup_and_exit(p, f_data,
					"Map must contain exactly one starting player position.");
			p->player_start_x = x;
			p->player_start_y = y;
			p->player_direction = c;
			p->player_count++;
		}
		x++;
	}
}

void	validate_map_content(t_params *p, t_file_data *f_data)
{
	int	y;
	int	has_wall;

	has_wall = 0;
	y = 0;
	while (p->map[y])
	{
		check_char_and_player(p, y, f_data);
		if (ft_strchr(p->map[y], '1'))
			has_wall = 1;
		y++;
	}
	finalize_validation(p, has_wall, f_data);
}
