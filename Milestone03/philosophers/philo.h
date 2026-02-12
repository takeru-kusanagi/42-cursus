/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   philo.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/16 15:47:46 by ktakeru           #+#    #+#             */
/*   Updated: 2025/09/18 18:53:14 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PHILO_H
# define PHILO_H

# include <pthread.h>
# include <stdio.h>
# include <stdlib.h>
# include <string.h>
# include <sys/time.h>
# include <unistd.h>

typedef struct s_philo	t_philo;

typedef struct s_args
{
	int					num_philo;
	long long			time_to_die;
	long long			time_to_eat;
	long long			time_to_sleep;
	int					num_of_meals_to_eat;
	long long			start_time;
	int					died;
	pthread_mutex_t		*forks;
	pthread_mutex_t		print_mutex;
	pthread_mutex_t		data_mutex;
	t_philo				*philos;
}						t_args;

typedef struct s_philo
{
	int					id;
	int					eat_count;
	long long			last_eat_time;
	pthread_mutex_t		*left_fork;
	pthread_mutex_t		*right_fork;
	struct s_args		*args;
}						t_philo;

// 02 validate&parse args
int						validate_input(int ac, char **av);
int						parse_args(int ac, char **av, t_args *args);

// 03 init mutex and philo data
int						init_philos(t_philo *philos, t_args *args);
long long				get_current_time_ms(void);
void					precise_sleep(long long ms);
// int						init_philo_data(t_philo *philos, t_args *args);

// 04 simulation
int						start_simulation(t_philo *philos, t_args *args);
void					*monitor_routine(void *args_ptr);
void					*philo_routine(void *philo_ptr);
void					log_state(t_philo *philo, const char *state);
void					take_forks_and_eat(t_philo *philo);
void					sleep_and_think(t_philo *philo);

// 05 clean up
void					cleanup(t_philo *philos, t_args *args);

#endif
