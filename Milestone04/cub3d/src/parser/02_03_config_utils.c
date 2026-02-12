/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02_03_config_utils.c                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 20:05:39 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 20:06:53 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

int	ft_isspace(const char s)
{
	return (s == ' ' || s == '\t' || s == '\n' || s == '\v'
		|| s == '\f' || s == '\r');
}

const char	*ft_strtrim_start(const char *s)
{
	if (s == NULL)
		return (NULL);
	while (*s && ft_isspace(*s))
		s++;
	return (s);
}

int	is_valid_number_string(char *s)
{
	if (!s || *s == '\0')
		return (0);
	if (*s == '+' || *s == '-')
		return (0);
	while (*s)
	{
		if (!ft_isdigit(*s))
			return (0);
		s++;
	}
	return (1);
}
