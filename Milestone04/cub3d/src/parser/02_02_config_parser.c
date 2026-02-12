/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02_02_config_parser.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/20 17:32:41 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 20:05:35 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static int	validate_and_assign_rgb(char **strs, int *r, int *g, int *b)
{
	long		val;
	const char	*trimmed;

	if (!strs[0] || !strs[1] || !strs[2] || strs[3])
		return (-1);
	trimmed = ft_strtrim_start(strs[0]);
	val = ft_atoi(trimmed);
	if (val < 0 || val > 255 || !is_valid_number_string((char *)trimmed))
		return (-1);
	*r = (int)val;
	trimmed = ft_strtrim_start(strs[1]);
	val = ft_atoi(trimmed);
	if (val < 0 || val > 255 || !is_valid_number_string((char *)trimmed))
		return (-1);
	*g = (int)val;
	trimmed = ft_strtrim_start(strs[2]);
	val = ft_atoi(trimmed);
	if (val < 0 || val > 255 || !is_valid_number_string((char *)trimmed))
		return (-1);
	*b = (int)val;
	return (0);
}

static int	ft_parse_rgb(const char *s, int *r, int *g, int *b)
{
	char	**rgb_strs;
	int		result;

	rgb_strs = ft_split(s, ',');
	if (!rgb_strs)
		return (-2);
	result = validate_and_assign_rgb(rgb_strs, r, g, b);
	ft_free_split(rgb_strs);
	return (result);
}

static char	*get_clean_color_string(t_params *p, t_file_data *f_data,
		const char *line_start)
{
	const char	*s_raw;
	char		*s_clean;

	s_raw = ft_strtrim_start(line_start);
	s_clean = ft_strdup_without_newline(s_raw);
	if (!s_clean)
		exit_with_cleanup(f_data, p,
			"Memory allocation failed for clean color string.");
	return (s_clean);
}

void	parse_color(t_params *p, t_file_data *f_data, const char *line_start,
		int *color_ptr)
{
	int		r;
	int		g;
	int		b;
	int		parse_result;
	char	*s_clean;

	if (*color_ptr != 0)
		exit_with_cleanup(f_data, p,
			"Duplicate floor/ceiling color identifier found.");
	s_clean = get_clean_color_string(p, f_data, line_start);
	parse_result = ft_parse_rgb(s_clean, &r, &g, &b);
	free(s_clean);
	if (parse_result == -1)
		exit_with_cleanup(f_data, p,
			"Invalid color format or value. Must be R,G,B (0-255).");
	if (parse_result == -2)
		exit_with_cleanup(f_data, p,
			"Memory allocation failed during color parsing.");
	*color_ptr = (r << 16) | (g << 8) | b;
	p->config_count++;
}
