/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   03.sort_small.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/19 14:25:09 by ktakeru           #+#    #+#             */
/*   Updated: 2025/06/24 20:58:07 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "stack.h"

void	sort_three(t_stack **a)
{
	int	n1;
	int	n2;
	int	n3;

	if (!(*a) || !((*a)->next) || !((*a)->next->next))
		return ;
	n1 = (*a)->value;
	n2 = (*a)->next->value;
	n3 = (*a)->next->next->value;
	if (n1 < n2 && n2 > n3 && n1 < n3)
	{
		sa(a);
		ra(a);
	}
	else if (n1 > n2 && n2 < n3 && n1 < n3)
		sa(a);
	else if (n1 < n2 && n2 > n3 && n1 > n3)
		rra(a);
	else if (n1 > n2 && n2 < n3 && n1 > n3)
		ra(a);
	else if (n1 > n2 && n2 > n3 && n1 > n3)
	{
		sa(a);
		rra(a);
	}
}

void	sort_four(t_stack **a, t_stack **b)
{
	int	min;

	while (stack_size(*a) > 3)
	{
		min = min_value(*a);
		while ((*a)->value != min)
		{
			if (get_index(*a, min) <= stack_size(*a) / 2)
				ra(a);
			else
				rra(a);
		}
		pb(a, b);
	}
	sort_three(a);
	pa(a, b);
}

void	sort_five(t_stack **a, t_stack **b)
{
	int	min;

	while (stack_size(*a) > 3)
	{
		min = min_value(*a);
		while ((*a)->value != min)
		{
			if (get_index(*a, min) <= stack_size(*a) / 2)
				ra(a);
			else
				rra(a);
		}
		pb(a, b);
	}
	sort_three(a);
	pa(a, b);
	pa(a, b);
}
