/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   04_01_simulation.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/16 19:14:39 by ktakeru           #+#    #+#             */
/*   Updated: 2025/09/22 15:34:56 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

static int	create_threads(pthread_t *threads, pthread_t *monitor,
		t_philo *philos, t_args *args)
{
	int	i;

	i = 0;
	while (i < args->num_philo)
	{
		if (pthread_create(&threads[i], NULL, philo_routine, &philos[i]) != 0)
			return (1);
		i++;
	}
	if (pthread_create(monitor, NULL, monitor_routine, args) != 0)
		return (1);
	return (0);
}

static void	join_threads(pthread_t *threads, pthread_t monitor, t_args *args)
{
	int	i;

	i = 0;
	while (i < args->num_philo)
	{
		pthread_join(threads[i], NULL);
		i++;
	}
	pthread_join(monitor, NULL);
}

int	start_simulation(t_philo *philos, t_args *args)
{
	pthread_t	*threads;
	pthread_t	monitor_thread;

	args->philos = philos;
	threads = (pthread_t *)malloc(sizeof(pthread_t) * args->num_philo);
	if (!threads)
		return (1);
	if (create_threads(threads, &monitor_thread, philos, args) != 0)
	{
		free(threads);
		return (1);
	}
	join_threads(threads, monitor_thread, args);
	free(threads);
	return (0);
}
