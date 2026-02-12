/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   99_error.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/15 21:32:46 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/17 19:21:59 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "pipex.h"

void	is_ac_5(int ac)
{
	if (ac != 5)
	{
		write(2, "Error: wrong argument count\n", 28);
		exit(EXIT_FAILURE);
	}
}

void	exit_with_error(char *file_name)
{
	perror(file_name);
	exit(EXIT_FAILURE);
}

void	free_split(char **arr)
{
	int	i;

	i = 0;
	if (!arr)
		return ;
	while (arr[i])
	{
		free(arr[i]);
		i++;
	}
	free(arr);
}

void	command_not_found(char *original_cmd_str)
{
	char	**temp_split;

	temp_split = ft_split(original_cmd_str, ' ');
	if (temp_split && temp_split[0])
		ft_putendl_fd(temp_split[0], STDERR_FILENO);
	else
		ft_putendl_fd(original_cmd_str, STDERR_FILENO);
	ft_putstr_fd(": command not found\n", STDERR_FILENO);
	free_split(temp_split);
	exit(127);
}
