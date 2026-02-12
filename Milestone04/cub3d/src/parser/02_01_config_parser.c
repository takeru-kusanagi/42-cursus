/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02_01_config_parser.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/20 17:18:56 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 19:35:04 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static void	parse_texture(t_params *p, t_file_data *f_data,
		const char *line_start, char **path_ptr)
{
	const char	*path;
	int			fd;

	if (*path_ptr != NULL)
		exit_with_cleanup(f_data, p, "Duplicate texture identifier found.");
	path = ft_strtrim_start(line_start);
	if (*path == '\0' || ft_strlen(path) == 1)
		exit_with_cleanup(f_data, p, "Texture path is missing.");
	*path_ptr = ft_strdup_without_newline(path);
	if (*path_ptr == NULL)
		exit_with_cleanup(f_data, p,
			"Memory allocation failed for texture path.");
	fd = open(*path_ptr, O_RDONLY);
	if (fd == -1)
	{
		free(*path_ptr);
		*path_ptr = NULL;
		exit_with_cleanup(f_data, p,
			"Texture file not found or cannot be opened.");
	}
	close(fd);
	p->config_count++;
}

static void	handle_identifiers(t_params *p, t_file_data *f_data,
		const char *trimmed_line)
{
	if (ft_strncmp(trimmed_line, "NO ", 3) == 0)
		parse_texture(p, f_data, trimmed_line + 3, &(p->north_tex_path));
	else if (ft_strncmp(trimmed_line, "SO ", 3) == 0)
		parse_texture(p, f_data, trimmed_line + 3, &(p->south_tex_path));
	else if (ft_strncmp(trimmed_line, "WE ", 3) == 0)
		parse_texture(p, f_data, trimmed_line + 3, &(p->west_tex_path));
	else if (ft_strncmp(trimmed_line, "EA ", 3) == 0)
		parse_texture(p, f_data, trimmed_line + 3, &(p->east_tex_path));
	else if (ft_strncmp(trimmed_line, "F ", 2) == 0)
		parse_color(p, f_data, trimmed_line + 2, &(p->floor_color));
	else if (ft_strncmp(trimmed_line, "C ", 2) == 0)
		parse_color(p, f_data, trimmed_line + 2, &(p->ceiling_color));
	else
		exit_with_cleanup(f_data, p,
			"Invalid identifier found before map data.");
}

static void	process_line(t_params *p, t_file_data *f_data, const char *line,
		int line_index)
{
	const char	*trimmed_line;

	trimmed_line = ft_strtrim_start(line);
	if (*trimmed_line == '\0')
		return ;
	if (p->config_count == 6)
	{
		if (p->first_map_line == 0)
			p->first_map_line = line_index;
		return ;
	}
	handle_identifiers(p, f_data, trimmed_line);
}

static t_params	*init_params(t_file_data *file_data)
{
	t_params	*params;

	params = (t_params *)malloc(sizeof(t_params));
	if (!params)
		exit_with_cleanup(file_data, NULL,
			"Memory allocation failed for config structure.");
	ft_bzero(params, sizeof(t_params));
	return (params);
}

t_params	*parse_config(t_file_data *file_data)
{
	t_params	*params;
	int			i;

	params = init_params(file_data);
	i = 0;
	while (i < file_data->line_count)
	{
		process_line(params, file_data, file_data->lines[i], i);
		i++;
	}
	if (params->config_count != 6)
		exit_with_cleanup(file_data, params,
			"Missing required config (NO,SO,WE,EA,F,C).");
	if (params->first_map_line == 0)
		exit_with_cleanup(file_data, params, "Map data is missing or empty.");
	return (params);
}
