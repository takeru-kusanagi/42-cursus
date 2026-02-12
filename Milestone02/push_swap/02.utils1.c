/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   02.utils1.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/18 19:19:12 by ktakeru           #+#    #+#             */
/*   Updated: 2025/06/27 16:54:28 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "stack.h"

void	add_back(t_stack **stack, t_stack *new_node)
{
	t_stack	*last;

	if (!*stack)
	{
		*stack = new_node;
		return ;
	}
	last = *stack;
	while (last->next != NULL)
		last = last->next;
	last->next = new_node;
	new_node->prev = last;
}

t_stack	*new_node(int data)
{
	t_stack	*node;

	node = malloc(sizeof(t_stack));
	if (!node)
		return (NULL);
	node->value = data;
	node->index = 0;
	node->next = NULL;
	node->prev = NULL;
	return (node);
}

int	is_duplicate(t_stack *stack, int num)
{
	if (!stack)
		return (0);
	while (stack)
	{
		if (stack->value == num)
			return (1);
		stack = stack->next;
	}
	return (0);
}

long	ft_atol(char *num)
{
	long	res;
	long	i;
	long	sign;

	i = 0;
	res = 0;
	sign = 1;
	while ((num[i] >= 9 && num[i] <= 13) || num[i] == ' ')
		i++;
	if (num[i] == '-' || num[i] == '+')
	{
		if (num[i] == '-')
			sign *= -1;
		i++;
	}
	if (!(num[i] >= '0' && num[i] <= '9'))
		exit_error();
	while (num[i] >= '0' && num[i] <= '9')
		res = res * 10 + num[i++] - '0';
	if (num[i] != '\0')
		exit_error();
	return (res * sign);
}
