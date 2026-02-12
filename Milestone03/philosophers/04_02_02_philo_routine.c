/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   04_02_02_philo_routine.c                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/17 18:29:25 by ktakeru           #+#    #+#             */
/*   Updated: 2025/09/18 20:20:43 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

void	log_state(t_philo *philo, const char *state)
{
	long long	timestamp;

	pthread_mutex_lock(&philo->args->print_mutex);
	timestamp = get_current_time_ms() - philo->args->start_time;
	if (!philo->args->died)
		printf("%lld %d %s\n", timestamp, philo->id, state);
	pthread_mutex_unlock(&philo->args->print_mutex);
}

void	take_forks_and_eat(t_philo *philo)
{
	pthread_mutex_lock(philo->left_fork);
	log_state(philo, "has taken a fork");
	pthread_mutex_lock(&philo->args->data_mutex);
	if (philo->args->died)
	{
		pthread_mutex_unlock(&philo->args->data_mutex);
		pthread_mutex_unlock(philo->left_fork);
		return ;
	}
	pthread_mutex_unlock(&philo->args->data_mutex);
	pthread_mutex_lock(philo->right_fork);
	log_state(philo, "has taken a fork");
	log_state(philo, "is eating");
	pthread_mutex_lock(&philo->args->data_mutex);
	philo->last_eat_time = get_current_time_ms();
	philo->eat_count++;
	pthread_mutex_unlock(&philo->args->data_mutex);
	usleep(philo->args->time_to_eat * 1000);
	pthread_mutex_unlock(philo->left_fork);
	pthread_mutex_unlock(philo->right_fork);
}

void	sleep_and_think(t_philo *philo)
{
	log_state(philo, "is sleeping");
	usleep(philo->args->time_to_sleep * 1000);
	log_state(philo, "is thinking");
}
