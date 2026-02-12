/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   04_03_monitor_routine.c                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/16 19:40:36 by ktakeru           #+#    #+#             */
/*   Updated: 2025/09/18 20:27:46 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

static int	check_starvation(t_args *args)
{
	int	i;

	i = 0;
	while (i < args->num_philo)
	{
		pthread_mutex_lock(&args->data_mutex);
		if (get_current_time_ms()
			- args->philos[i].last_eat_time > args->time_to_die)
		{
			pthread_mutex_lock(&args->print_mutex);
			printf("%lld %d died\n", get_current_time_ms() - args->start_time,
				args->philos[i].id);
			args->died = 1;
			pthread_mutex_unlock(&args->print_mutex);
			pthread_mutex_unlock(&args->data_mutex);
			return (1);
		}
		pthread_mutex_unlock(&args->data_mutex);
		i++;
	}
	return (0);
}

static int	check_meal_count(t_args *args)
{
	int	i;

	if (args->num_of_meals_to_eat == -1)
		return (0);
	i = 0;
	pthread_mutex_lock(&args->data_mutex);
	while (i < args->num_philo)
	{
		if (args->philos[i].eat_count < args->num_of_meals_to_eat)
		{
			pthread_mutex_unlock(&args->data_mutex);
			return (0);
		}
		i++;
	}
	pthread_mutex_unlock(&args->data_mutex);
	return (1);
}

void	*monitor_routine(void *args_ptr)
{
	t_args	*args;

	args = (t_args *)args_ptr;
	while (1)
	{
		if (check_starvation(args) == 1)
			return (NULL);
		if (check_meal_count(args) == 1)
			return (NULL);
	}
	return (NULL);
}
