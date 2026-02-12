/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   01_01_read_file.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/20 16:49:43 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/27 17:09:13 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static int	check_and_open_file(const char *filename)
{
	int	fd;

	if (filename == NULL || ft_strlen(filename) < 5 || ft_strstr(filename,
			".cub") == NULL || ft_strstr(filename, ".cub") != filename
		+ ft_strlen(filename) - 4)
		exit_with_cleanup(NULL, NULL,
			"Invalid file name or extension. Must be .cub");
	fd = open(filename, O_RDONLY);
	if (fd == -1)
		exit_with_cleanup(NULL, NULL,
			"Could not open file or file does not exist.");
	return (fd);
}

static t_file_data	*init_file_data(int fd)
{
	t_file_data	*data;

	data = (t_file_data *)malloc(sizeof(t_file_data));
	if (!data)
	{
		close(fd);
		exit_with_cleanup(NULL, NULL,
			"Memory allocation failed for file data.");
	}
	data->lines = NULL;
	data->line_count = 0;
	return (data);
}

t_file_data	*read_file_to_list(const char *filename)
{
	int			fd;
	t_file_data	*data;

	fd = check_and_open_file(filename);
	data = init_file_data(fd);
	read_lines_into_data(data, fd);
	close(fd);
	return (data);
}
