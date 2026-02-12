/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ops2_push.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/23 17:32:09 by ktakeru           #+#    #+#             */
/*   Updated: 2025/06/23 17:32:10 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "stack.h"

void	push(t_stack **from, t_stack **to)
{
	t_stack	*node;

	if (!(*from))
		return ;
	node = (*from);
	*from = (*from)->next;
	if (*from)
		(*from)->prev = NULL;
	node->next = (*to);
	if (*to)
		(*to)->prev = node;
	*to = node;
}

void	pa(t_stack **a, t_stack **b)
{
	push(b, a);
	write(1, "pa\n", 3);
}

void	pb(t_stack **a, t_stack **b)
{
	push(a, b);
	write(1, "pb\n", 3);
}
