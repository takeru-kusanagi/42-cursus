/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02_validate_and_parse_args.c                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/09/16 17:55:38 by ktakeru           #+#    #+#             */
/*   Updated: 2025/09/17 20:15:42 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

static long long	ft_atol(const char *str)
{
	long long	res;
	int			sign;
	int			i;

	res = 0;
	sign = 1;
	i = 0;
	while (str[i] == ' ' || (str[i] >= 9 && str[i] <= 13))
		i++;
	if (str[i] == '-' || str[i] == '+')
	{
		if (str[i] == '-')
			sign = -1;
		i++;
	}
	while (str[i] >= '0' && str[i] <= '9')
	{
		res = res * 10 + (str[i] - '0');
		i++;
	}
	return (sign * res);
}

int	parse_args(int ac, char **av, t_args *args)
{
	args->num_philo = (int)ft_atol(av[1]);
	args->time_to_die = ft_atol(av[2]);
	args->time_to_eat = ft_atol(av[3]);
	args->time_to_sleep = ft_atol(av[4]);
	if (ac == 6)
		args->num_of_meals_to_eat = (int)ft_atol(av[5]);
	else
		args->num_of_meals_to_eat = -1;
	if (args->num_philo <= 0 || args->time_to_die < 0 || args->time_to_eat < 0
		|| args->time_to_sleep < 0)
	{
		write(2, "Error: Arguments must be positive numbers.\n", 43);
		return (1);
	}
	if (ac == 6 && args->num_of_meals_to_eat <= 0)
	{
		write(2, "Error: Optional argument must be a positive number.\n", 52);
		return (1);
	}
	return (0);
}

static int	is_numeric(char *s)
{
	int	i;

	i = 0;
	if (s[0] == '\0')
		return (0);
	if (s[0] == '+' || s[0] == '-')
		i++;
	while (s[i])
	{
		if (s[i] < '0' || s[i] > '9')
			return (0);
		i++;
	}
	if (i == 1 && (s[0] == '+' || s[0] == '-'))
		return (0);
	return (1);
}

int	validate_input(int ac, char **av)
{
	int	i;

	if (ac < 5 || ac > 6)
	{
		write(2, "Error: Invalid number of arguments.\n", 36);
		return (1);
	}
	i = 1;
	while (av[i])
	{
		if (!is_numeric(av[i]))
		{
			write(2, "Error: Arguments must be valid numeric strings.\n", 48);
			return (1);
		}
		i++;
	}
	return (0);
}
