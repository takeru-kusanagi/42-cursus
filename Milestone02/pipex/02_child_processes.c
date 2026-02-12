/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02.child_processes.c                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/11 19:25:42 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/16 21:00:26 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "pipex.h"

void	execve_cmd2(char **av, char **envp)
{
	char	**cmd_args;
	char	*cmd_path;

	cmd_args = split_cmd(av[3]);
	if (!cmd_args)
		exit_with_error("split_cmd failed");
	if (!cmd_args[0] || cmd_args[0][0] == '\0')
	{
		free_split(cmd_args);
		command_not_found(av[3]);
	}
	cmd_path = get_cmd_path(cmd_args[0], envp);
	if (!cmd_path)
	{
		free_split(cmd_args);
		command_not_found(av[3]);
	}
	execve(cmd_path, cmd_args, envp);
	free(cmd_path);
	free_split(cmd_args);
	perror("execve cmd2");
	exit(EXIT_FAILURE);
}

void	child2_process(int *pipefd, char **av, char **envp)
{
	int	fd_out;

	fd_out = open(av[4], O_CREAT | O_WRONLY | O_TRUNC, 0644);
	if (fd_out < 0)
	{
		close(pipefd[0]);
		close(pipefd[1]);
		exit_with_error(av[4]);
	}
	dup2(pipefd[0], 0);
	dup2(fd_out, 1);
	close(fd_out);
	close(pipefd[0]);
	close(pipefd[1]);
	execve_cmd2(av, envp);
}

void	execve_cmd1(char **av, char **envp)
{
	char	**cmd_args;
	char	*cmd_path;

	cmd_args = split_cmd(av[2]);
	if (!cmd_args)
		exit_with_error("split_cmd failed");
	if (!cmd_args[0] || cmd_args[0][0] == '\0')
	{
		free_split(cmd_args);
		command_not_found(av[2]);
	}
	cmd_path = get_cmd_path(cmd_args[0], envp);
	if (!cmd_path)
	{
		free_split(cmd_args);
		command_not_found(av[2]);
	}
	execve(cmd_path, cmd_args, envp);
	free(cmd_path);
	free_split(cmd_args);
	perror("execve cmd1");
	exit(EXIT_FAILURE);
}

void	child1_process(int *pipefd, char **av, char **envp)
{
	int	fd_in;

	fd_in = open(av[1], O_RDONLY);
	if (fd_in < 0)
	{
		close(pipefd[0]);
		close(pipefd[1]);
		exit_with_error(av[1]);
	}
	dup2(fd_in, 0);
	dup2(pipefd[1], 1);
	close(fd_in);
	close(pipefd[0]);
	close(pipefd[1]);
	execve_cmd1(av, envp);
}
