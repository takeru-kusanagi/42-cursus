/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   05_cleanup.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/16 19:42:52 by ktakeru           #+#    #+#             */
/*   Updated: 2025/09/16 20:00:23 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

void	cleanup(t_philo *philos, t_args *args)
{
	int	i;

	i = 0;
	while (i < args->num_philo)
	{
		pthread_mutex_destroy(&args->forks[i]);
		i++;
	}
	pthread_mutex_destroy(&args->print_mutex);
	pthread_mutex_destroy(&args->data_mutex);
	free(args->forks);
	free(philos);
}
