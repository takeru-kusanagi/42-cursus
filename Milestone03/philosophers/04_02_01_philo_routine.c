/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   04_02_01_philo_routine.c                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/16 19:39:29 by ktakeru           #+#    #+#             */
/*   Updated: 2025/09/18 19:24:37 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

static void	*philo_one_routine(t_philo *philo)
{
	pthread_mutex_lock(philo->left_fork);
	log_state(philo, "has taken a fork");
	usleep(philo->args->time_to_die * 1000);
	pthread_mutex_unlock(philo->left_fork);
	return (NULL);
}

static void	*philo_multi_routine(t_philo *philo)
{
	if (philo->id % 2 == 0)
		usleep(philo->args->time_to_eat / 2);
	while (1)
	{
		pthread_mutex_lock(&philo->args->data_mutex);
		if (philo->args->died || (philo->args->num_of_meals_to_eat != -1
				&& philo->eat_count >= philo->args->num_of_meals_to_eat))
		{
			pthread_mutex_unlock(&philo->args->data_mutex);
			break ;
		}
		pthread_mutex_unlock(&philo->args->data_mutex);
		take_forks_and_eat(philo);
		pthread_mutex_lock(&philo->args->data_mutex);
		if (philo->args->died || (philo->args->num_of_meals_to_eat != -1
				&& philo->eat_count >= philo->args->num_of_meals_to_eat))
		{
			pthread_mutex_unlock(&philo->args->data_mutex);
			break ;
		}
		pthread_mutex_unlock(&philo->args->data_mutex);
		sleep_and_think(philo);
	}
	return (NULL);
}

void	*philo_routine(void *philo_ptr)
{
	t_philo	*philo;

	philo = (t_philo *)philo_ptr;
	if (philo->args->num_philo == 1)
		return (philo_one_routine(philo));
	else
		return (philo_multi_routine(philo));
}
