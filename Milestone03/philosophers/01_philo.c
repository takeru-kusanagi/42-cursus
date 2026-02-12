/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   01_philo.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/16 16:52:44 by ktakeru           #+#    #+#             */
/*   Updated: 2025/09/22 15:35:30 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	main(int ac, char **av)
{
	t_args	args;
	t_philo	*philos;

	memset(&args, 0, sizeof(args));
	if (validate_input(ac, av) != 0)
		return (1);
	if (parse_args(ac, av, &args) != 0)
		return (1);
	philos = (t_philo *)malloc(sizeof(t_philo) * args.num_philo);
	if (!philos)
		return (1);
	args.forks = (pthread_mutex_t *)malloc(sizeof(pthread_mutex_t)
			* args.num_philo);
	if (!args.forks)
		return (free(philos), 1);
	if (init_philos(philos, &args) != 0)
		return (cleanup(philos, &args), 1);
	start_simulation(philos, &args);
	cleanup(philos, &args);
	return (0);
}
