/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   03_init_philos.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/16 18:06:59 by ktakeru           #+#    #+#             */
/*   Updated: 2025/09/18 18:52:05 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

long long	get_current_time_ms(void)
{
	struct timeval	tv;

	gettimeofday(&tv, NULL);
	return ((tv.tv_sec * 1000) + (tv.tv_usec / 1000));
}

static int	init_mutexes(t_args *args)
{
	int	i;

	i = 0;
	while (i < args->num_philo)
	{
		if (pthread_mutex_init(&args->forks[i], NULL) != 0)
			return (1);
		i++;
	}
	if (pthread_mutex_init(&args->print_mutex, NULL) != 0)
		return (1);
	if (pthread_mutex_init(&args->data_mutex, NULL) != 0)
		return (1);
	return (0);
}

static int	init_philo_data(t_philo *philos, t_args *args)
{
	int	i;

	args->start_time = get_current_time_ms();
	i = 0;
	while (i < args->num_philo)
	{
		philos[i].id = i + 1;
		philos[i].eat_count = 0;
		philos[i].last_eat_time = args->start_time;
		philos[i].args = args;
		philos[i].left_fork = &args->forks[i];
		if (i == args->num_philo - 1)
			philos[i].right_fork = &args->forks[0];
		else
			philos[i].right_fork = &args->forks[i + 1];
		i++;
	}
	return (0);
}

int	init_philos(t_philo *philos, t_args *args)
{
	if (init_mutexes(args) != 0)
		return (1);
	if (init_philo_data(philos, args) != 0)
		return (1);
	return (0);
}
