/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   01.main.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/18 17:34:56 by ktakeru           #+#    #+#             */
/*   Updated: 2025/06/27 17:53:21 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "stack.h"

void	sort(t_stack **stack_a, t_stack **stack_b)
{
	int	size;

	if (is_sorted(*stack_a) == 1)
		return ;
	size = stack_size(*stack_a);
	if (size == 2)
	{
		if ((*stack_a)->value > (*stack_a)->next->value)
			sa(stack_a);
	}
	else if (size == 3)
		sort_three(stack_a);
	else if (size == 4)
		sort_four(stack_a, stack_b);
	else if (size == 5)
		sort_five(stack_a, stack_b);
	else
	{
		set_index(*stack_a);
		radix_sort(stack_a, stack_b);
	}
}

void	build_stack_from_args(t_stack **stack, char **args)
{
	int		i;
	long	num;
	t_stack	*node;

	i = 0;
	while (args[i])
	{
		num = ft_atol(args[i]);
		if (num > INT_MAX || num < INT_MIN)
			exit_error();
		if (is_duplicate(*stack, (int)num) == 1)
			exit_error();
		node = new_node((int)num);
		if (!node)
			exit_error();
		add_back(stack, node);
		i++;
	}
}

int	main(int ac, char **av)
{
	t_stack	*stack_a;
	t_stack	*stack_b;
	char	**nums;

	stack_a = NULL;
	if (ac == 1)
		return (0);
	if (ac == 2)
	{
		nums = ft_split(av[1], ' ');
		if (!nums)
			exit_error();
		build_stack_from_args(&stack_a, nums);
		free_split(nums);
	}
	else
		build_stack_from_args(&stack_a, &av[1]);
	stack_b = NULL;
	sort(&stack_a, &stack_b);
	free_stack(&stack_a);
	return (0);
}
