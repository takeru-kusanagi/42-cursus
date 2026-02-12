/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ops4_reverse_rotate.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/23 17:32:18 by ktakeru           #+#    #+#             */
/*   Updated: 2025/06/23 18:21:54 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "stack.h"

void	reverse_rotate(t_stack **stack)
{
	t_stack	*head;
	t_stack	*last;
	t_stack	*new_last;

	if (!(*stack) || !((*stack)->next))
		return ;
	head = (*stack);
	last = (*stack);
	while (last->next)
		last = last->next;
	new_last = last->prev;
	if (new_last)
		new_last->next = NULL;
	last->prev = NULL;
	last->next = head;
	head->prev = last;
	*stack = last;
}

void	rra(t_stack **a)
{
	reverse_rotate(a);
	write(1, "rra\n", 4);
}

void	rrb(t_stack **b)
{
	reverse_rotate(b);
	write(1, "rrb\n", 4);
}

void	rrr(t_stack **a, t_stack **b)
{
	reverse_rotate(a);
	reverse_rotate(b);
	write(1, "rrr\n", 4);
}
