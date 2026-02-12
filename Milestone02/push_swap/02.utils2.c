/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02.utils2.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/27 14:43:48 by ktakeru           #+#    #+#             */
/*   Updated: 2025/06/27 17:53:32 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "stack.h"

int	is_sorted(t_stack *stack)
{
	if (!stack || !(stack->next))
		return (1);
	while (stack->next)
	{
		if (stack->value > stack->next->value)
			return (0);
		stack = stack->next;
	}
	return (1);
}

int	get_index(t_stack *stack, int value)
{
	int	i;

	i = 0;
	while (stack)
	{
		if (stack->value == value)
			return (i);
		stack = stack->next;
		i++;
	}
	exit_error();
	return (-1);
}

int	min_value(t_stack *stack)
{
	int	min_val;

	if (stack == NULL)
		exit_error();
	min_val = stack->value;
	stack = stack->next;
	while (stack != NULL)
	{
		if (stack->value < min_val)
			min_val = stack->value;
		stack = stack->next;
	}
	return (min_val);
}

int	stack_size(t_stack *stack)
{
	int	i;

	i = 0;
	while (stack)
	{
		i++;
		stack = stack->next;
	}
	return (i);
}
