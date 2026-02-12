/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02.read_map.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/03 19:15:52 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/04 17:12:25 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "so_long.h"

char	**expand_map(char **map, int old_cap, int new_cap)
{
	char	**new_map;
	int		i;

	new_map = malloc(sizeof(char *) * new_cap);
	if (!new_map)
		return (NULL);
	i = 0;
	while (i < old_cap)
	{
		new_map[i] = map[i];
		i++;
	}
	free(map);
	return (new_map);
}

char	**convert_to_map(char **map, int fd, int capacity)
{
	int		i;
	char	*line;

	i = 0;
	line = get_next_line(fd);
	while (line)
	{
		map[i++] = line;
		if (i >= capacity - 1)
		{
			capacity *= 2;
			map = expand_map(map, i, capacity);
			if (!map)
				return (NULL);
		}
		line = get_next_line(fd);
	}
	map[i] = NULL;
	return (map);
}

char	**read_map(char *filename)
{
	int		fd;
	char	**map;
	int		capacity;

	capacity = 10;
	map = malloc(sizeof(char *) * capacity);
	if (!map)
		return (NULL);
	fd = open(filename, O_RDONLY);
	if (fd < 0)
	{
		free(map);
		return (NULL);
	}
	map = convert_to_map(map, fd, capacity);
	close(fd);
	return (map);
}
