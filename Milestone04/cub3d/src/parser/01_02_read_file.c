/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   01_02_read_file.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/20 17:06:38 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/27 17:30:46 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static char	**copy_old_lines(char **new_lines, char **old_lines, int count)
{
	int	i;

	i = 0;
	while (i < count)
	{
		new_lines[i] = old_lines[i];
		i++;
	}
	if (old_lines)
		free(old_lines);
	return (new_lines);
}

static char	**ft_realloc_and_add_line(char **old_lines, int old_count,
		const char *new_line)
{
	char	**new_lines;

	new_lines = (char **)malloc(sizeof(char *) * (old_count + 2));
	if (!new_lines)
		return (NULL);
	new_lines = copy_old_lines(new_lines, old_lines, old_count);
	new_lines[old_count] = ft_strdup(new_line);
	if (!new_lines[old_count])
	{
		free(new_lines);
		return (NULL);
	}
	new_lines[old_count + 1] = NULL;
	return (new_lines);
}

void	read_lines_into_data(t_file_data *data, int fd)
{
	char	*line;
	char	**temp_lines;

	line = get_next_line(fd);
	while (line != NULL)
	{
		temp_lines = ft_realloc_and_add_line(data->lines, data->line_count,
				line);
		if (temp_lines == NULL)
		{
			close(fd);
			free(line);
			exit_with_cleanup(data, NULL,
				"Memory allocation failed while adding line.");
		}
		data->lines = temp_lines;
		free(line);
		data->line_count++;
		line = get_next_line(fd);
	}
}
