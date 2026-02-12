/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   03_01_map_parser.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+
	+:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+
	+#+        */
/*                                                +#+#+#+#+#+
	+#+           */
/*   Created: 2025/10/20 18:45:51 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 21:13:59 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

int	calculate_max_width(char **map)
{
	int	max_width;
	int	i;
	int	current_len;

	if (!map)
		return (0);
	max_width = 0;
	i = 0;
	while (map[i])
	{
		current_len = ft_strlen(map[i]);
		if (current_len > max_width)
			max_width = current_len;
		i++;
	}
	return (max_width);
}

static void	free_map_lines_upto(char **map, int i)
{
	int	k;

	k = 0;
	while (k < i)
	{
		if (map[k])
			free(map[k]);
		k++;
	}
}

static int	pad_map_to_rectangle(t_params *p)
{
	char	*new_line;
	int		y;
	int		current_len;

	y = 0;
	while (p->map[y])
	{
		current_len = ft_strlen(p->map[y]);
		if (current_len < p->map_width)
		{
			new_line = (char *)malloc(p->map_width + 1);
			if (!new_line)
			{
				return (0);
			}
			ft_memcpy(new_line, p->map[y], current_len);
			ft_memset(new_line + current_len, ' ', p->map_width - current_len);
			new_line[p->map_width] = '\0';
			free(p->map[y]);
			p->map[y] = new_line;
		}
		y++;
	}
	return (1);
}

static void	copy_map_lines(t_file_data *file_data, t_params *params,
		int map_row_count)
{
	int	i;
	int	j;

	params->map = (char **)malloc(sizeof(char *) * (map_row_count + 1));
	if (!params->map)
		exit_with_cleanup(file_data, params,
			"Memory allocation failed for map array.");
	i = 0;
	j = params->first_map_line;
	while (j < file_data->line_count)
	{
		params->map[i] = ft_strdup_without_newline(file_data->lines[j]);
		if (!params->map[i])
		{
			free_map_lines_upto(params->map, i);
			free(params->map);
			params->map = NULL;
			exit_with_cleanup(file_data, params,
				"Memory allocation failed during map line copy.");
		}
		i++;
		j++;
	}
	params->map[i] = NULL;
}

int	parse_map(t_file_data *file_data, t_params *params)
{
	int	map_row_count;

	map_row_count = file_data->line_count - params->first_map_line;
	if (map_row_count <= 0)
		exit_with_cleanup(file_data, params,
			"Map data is missing or fully empty.");
	copy_map_lines(file_data, params, map_row_count);
	params->map_height = map_row_count;
	params->map_width = calculate_max_width(params->map);
	validate_map_content(params, file_data);
	if (!pad_map_to_rectangle(params))
	{
		free_map_lines_upto(params->map, params->map_height);
		free(params->map);
		params->map = NULL;
		exit_with_cleanup(file_data, params,
			"Memory allocation failed during map padding.");
	}
	validate_map_closure(params, file_data);
	return (1);
}
