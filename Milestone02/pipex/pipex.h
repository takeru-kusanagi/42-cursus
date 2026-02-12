/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pipex.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/10 19:06:36 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/16 20:59:18 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PIPEX_H
# define PIPEX_H

# include <fcntl.h>
# include <stdio.h>
# include <stdlib.h>
# include <sys/types.h>
# include <sys/wait.h>
# include <unistd.h>

// 01.main
int		main(int ac, char **av, char **envp);
// 02.child processes
void	execve_cmd2(char **av, char **envp);
void	child2_process(int *pipefd, char **av, char **envp);
void	execve_cmd1(char **av, char **envp);
void	child1_process(int *pipefd, char **av, char **envp);
// 03.cmd functions
char	**split_path(char **envp);
char	*join_path_and_cmd(char *path, char *cmd);
char	*get_cmd_path(char *cmd, char **envp);
char	**split_cmd(char *cmd);
// 99.error & free
void	is_ac_5(int ac);
void	exit_with_error(char *file_name);
void	free_split(char **arr);
void	command_not_found(char *cmd);

// libft
int		ft_strncmp(const char *s1, const char *s2, size_t n);
char	**ft_split(char const *s, char c);
char	*ft_strdup(const char *s);
char	*ft_strjoin(char const *s1, char const *s2);
void	ft_putendl_fd(char *s, int fd);
void	ft_putstr_fd(char *s, int fd);

#endif
