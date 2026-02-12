/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   03_cmd_functions.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/15 18:19:00 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/25 19:12:25 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "pipex.h"

char	**split_path(char **envp)
{
	int		i;
	char	**paths;

	i = 0;
	while (envp[i] && ft_strncmp(envp[i], "PATH=", 5) != 0)
		i++;
	if (!envp[i])
		return (NULL);
	paths = ft_split(envp[i] + 5, ':');
	if (!paths)
		return (NULL);
	return (paths);
}

char	*join_path_and_cmd(char *path, char *cmd)
{
	char	*tmp;
	char	*full_path;

	tmp = ft_strjoin(path, "/");
	if (!tmp)
		return (NULL);
	full_path = ft_strjoin(tmp, cmd);
	if (!full_path)
	{
		free(tmp);
		return (NULL);
	}
	free(tmp);
	return (full_path);
}

char	*get_cmd_path(char *cmd, char **envp)
{
	char	**paths;
	int		i;
	char	*full_path;

	if ((cmd[0] == '.' || cmd[0] == '/') && access(cmd, X_OK) == 0)
		return (ft_strdup(cmd));
	paths = split_path(envp);
	if (!paths)
		return (NULL);
	i = 0;
	while (paths[i])
	{
		full_path = join_path_and_cmd(paths[i], cmd);
		if (!full_path)
			return (free_split(paths), NULL);
		if (access(full_path, X_OK) == 0)
			return (free_split(paths), full_path);
		free(full_path);
		i++;
	}
	free_split(paths);
	return (NULL);
}

char	**split_cmd(char *cmd)
{
	char	**res;

	res = ft_split(cmd, ' ');
	if (!res)
		return (NULL);
	return (res);
}
