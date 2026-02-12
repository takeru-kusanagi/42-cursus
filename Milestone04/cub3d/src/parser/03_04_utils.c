/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   03_04_utils.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/20 18:49:32 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 21:13:34 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

char	*ft_strdup_without_newline(const char *s)
{
	size_t	len;
	char	*dst;

	if (!s)
		return (NULL);
	len = ft_strlen(s);
	if (len > 0 && s[len - 1] == '\n')
		len--;
	dst = (char *)malloc(len + 1);
	if (!dst)
		return (NULL);
	ft_strlcpy(dst, s, len + 1);
	dst[len] = '\0';
	return (dst);
}

char	**duplicate_map(char **map, int height, t_params *p,
		t_file_data *f_data)
{
	char	**temp_map;
	int		y;

	temp_map = (char **)malloc(sizeof(char *) * (height + 1));
	if (!temp_map)
		exit_with_cleanup(f_data, p, "Memory allocation failed for temp map.");
	temp_map[height] = NULL;
	y = 0;
	while (y < height)
	{
		temp_map[y] = ft_strdup(map[y]);
		if (!temp_map[y])
		{
			temp_map[y] = NULL;
			free_temp_map(temp_map);
			exit_with_cleanup(f_data, p,
				"Memory allocation failed during map duplication.");
		}
		y++;
	}
	return (temp_map);
}
