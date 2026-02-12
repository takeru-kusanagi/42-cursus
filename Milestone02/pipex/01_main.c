/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   01.main.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/10 19:06:13 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/16 20:58:03 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "pipex.h"

int	main(int ac, char **av, char **envp)
{
	int		pipefd[2];
	pid_t	pid1;
	pid_t	pid2;
	int		status;

	is_ac_5(ac);
	if (pipe(pipefd) < 0)
		exit_with_error(av[1]);
	pid1 = fork();
	if (pid1 == 0)
		child1_process(pipefd, av, envp);
	pid2 = fork();
	if (pid2 == 0)
		child2_process(pipefd, av, envp);
	close(pipefd[0]);
	close(pipefd[1]);
	waitpid(pid1, NULL, 0);
	waitpid(pid2, &status, 0);
	return (WEXITSTATUS(status));
}
