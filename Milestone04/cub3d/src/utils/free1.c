/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   free.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+
	+:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+
	+#+        */
/*                                                +#+#+#+#+#+
	+#+           */
/*   Created: 2025/10/20 19:19:23 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 17:43:13 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

void	ft_free_split(char **strs)
{
	int	i;

	if (!strs)
		return ;
	i = 0;
	while (strs[i])
	{
		free(strs[i]);
		i++;
	}
	free(strs);
}

void	free_temp_map(char **map)
{
	int	y;

	if (!map)
		return ;
	y = 0;
	while (map[y])
	{
		free(map[y]);
		y++;
	}
	free(map);
}

void	free_params(t_params *params)
{
	int	i;

	if (!params)
		return ;
	if (params->north_tex_path)
		free(params->north_tex_path);
	if (params->south_tex_path)
		free(params->south_tex_path);
	if (params->west_tex_path)
		free(params->west_tex_path);
	if (params->east_tex_path)
		free(params->east_tex_path);
	if (params->map)
	{
		i = 0;
		while (params->map[i])
		{
			free(params->map[i]);
			i++;
		}
		free(params->map);
	}
	free(params);
}

void	free_file_data(t_file_data *file_data)
{
	int	i;

	if (!file_data)
		return ;
	if (file_data->lines)
	{
		i = 0;
		while (i < file_data->line_count)
		{
			if (file_data->lines[i])
				free(file_data->lines[i]);
			i++;
		}
		free(file_data->lines);
	}
	free(file_data);
}
