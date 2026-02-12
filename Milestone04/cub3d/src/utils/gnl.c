/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gnl.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/20 16:38:40 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 21:08:15 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static char	*update_save(char *save)
{
	int		i;
	int		j;
	char	*new_save;

	i = 0;
	while (save[i] != '\0' && save[i] != '\n')
		i++;
	if (!save[i])
		return (free(save), NULL);
	i++;
	if (!save[i])
		return (free(save), NULL);
	new_save = malloc((ft_strlen(save) - i + 1) * sizeof(char));
	if (!new_save)
		return (free(save), NULL);
	j = 0;
	while (save[i])
		new_save[j++] = save[i++];
	new_save[j] = '\0';
	free(save);
	return (new_save);
}

static char	*extract_line(char *save)
{
	char	*new_line;
	int		i;

	if (save == NULL || save[0] == '\0')
		return (NULL);
	i = 0;
	while (save[i] != '\0' && save[i] != '\n')
		i++;
	new_line = malloc((i + 2) * sizeof(char));
	if (!new_line)
		return (NULL);
	i = 0;
	while (save[i] != '\0' && save[i] != '\n')
	{
		new_line[i] = save[i];
		i++;
	}
	if (save[i] == '\n')
	{
		new_line[i] = save[i];
		i++;
	}
	new_line[i] = '\0';
	return (new_line);
}

static int	read_and_join(int fd, char **save_ptr, char *buf)
{
	ssize_t	read_byte;
	char	*temp;

	read_byte = read(fd, buf, BUFFER_SIZE);
	if (read_byte == -1)
	{
		free(*save_ptr);
		*save_ptr = NULL;
		return (-1);
	}
	buf[read_byte] = '\0';
	if (read_byte == 0 && (*save_ptr == NULL || (*save_ptr)[0] == '\0'))
		return (0);
	temp = *save_ptr;
	*save_ptr = ft_strjoin(temp, buf);
	if (!*save_ptr)
	{
		free(temp);
		return (-1);
	}
	free(temp);
	return (read_byte);
}

static char	*read_and_save(int fd, char *save)
{
	ssize_t	byte_read;
	char	*buf;

	if (!save)
	{
		save = ft_strdup("");
	}
	buf = malloc((BUFFER_SIZE + 1) * sizeof(char));
	if (!buf)
	{
		free(save);
		return (NULL);
	}
	byte_read = 1;
	while ((ft_strchr(save, '\n') == NULL) && byte_read > 0)
	{
		byte_read = read_and_join(fd, &save, buf);
		if (byte_read < 0)
		{
			free(buf);
			return (NULL);
		}
	}
	free(buf);
	return (save);
}

char	*get_next_line(int fd)
{
	static char	*save;
	char		*line;

	if (fd < 0 || BUFFER_SIZE <= 0)
		return (NULL);
	save = read_and_save(fd, save);
	if (!save)
		return (NULL);
	line = extract_line(save);
	save = update_save(save);
	return (line);
}
