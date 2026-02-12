/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   03_03_map_closure.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+
	+:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+
	+#+        */
/*                                                +#+#+#+#+#+
	+#+           */
/*   Created: 2025/10/20 19:05:09 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 21:25:04 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static void	map_error_cleanup(char **temp_map, t_params *p, t_file_data *f_data,
		const char *msg)
{
	if (temp_map)
		free_temp_map(temp_map);
	exit_with_cleanup(f_data, p, msg);
}

static char	**init_closure_check(t_params *p, t_file_data *f_data)
{
	char	**temp_map;
	int		y;
	int		x;

	temp_map = duplicate_map(p->map, p->map_height, p, f_data);
	if (!temp_map)
		map_error_cleanup(NULL, p, f_data,
			"Memory allocation failed for closure check.");
	y = 0;
	while (temp_map[y])
	{
		x = 0;
		while (temp_map[y][x])
		{
			if (temp_map[y][x] == ' ')
				temp_map[y][x] = 'F';
			else if (temp_map[y][x] == 'N' || temp_map[y][x] == 'S'
				|| temp_map[y][x] == 'W' || temp_map[y][x] == 'E')
				temp_map[y][x] = '0';
			x++;
		}
		y++;
	}
	return (temp_map);
}

static void	flood_fill(char **map, int x, int y, t_params *p)
{
	if (y < 0 || y >= p->map_height || x < 0 || x >= p->map_width)
		return ;
	if (map[y][x] == '1' || map[y][x] == 'V')
		return ;
	map[y][x] = 'V';
	flood_fill(map, x + 1, y, p);
	flood_fill(map, x - 1, y, p);
	flood_fill(map, x, y + 1, p);
	flood_fill(map, x, y - 1, p);
}

static void	run_flood_fill(char **temp_map, t_params *p)
{
	int	y;
	int	x;

	y = 0;
	while (y < p->map_height)
	{
		if (temp_map[y][0] == 'F' || temp_map[y][0] == '0')
			flood_fill(temp_map, 0, y, p);
		if (temp_map[y][p->map_width - 1] == 'F' || temp_map[y][p->map_width
			- 1] == '0')
			flood_fill(temp_map, p->map_width - 1, y, p);
		y++;
	}
	x = 0;
	while (x < p->map_width)
	{
		if (temp_map[0][x] == 'F' || temp_map[0][x] == '0')
			flood_fill(temp_map, x, 0, p);
		if (temp_map[p->map_height - 1][x] == 'F' || temp_map[p->map_height
			- 1][x] == '0')
			flood_fill(temp_map, x, p->map_height - 1, p);
		x++;
	}
}

void	validate_map_closure(t_params *params, t_file_data *f_data)
{
	char	**temp_map;
	int		y;
	int		x;

	temp_map = init_closure_check(params, f_data);
	params->temp_map_for_cleanup = temp_map;
	params->file_data_for_cleanup = f_data;
	run_flood_fill(temp_map, params);
	y = 0;
	while (y < params->map_height)
	{
		x = 0;
		while (x < params->map_width)
		{
			if (temp_map[y][x] == 'V' && (params->map[y][x] == '0'
					|| ft_strchr("NSEW", params->map[y][x])))
				map_error_cleanup(temp_map, params, f_data,
					"Map is not fully enclosed by walls.");
			x++;
		}
		y++;
	}
	params->temp_map_for_cleanup = NULL;
	params->file_data_for_cleanup = NULL;
	free_temp_map(temp_map);
}
