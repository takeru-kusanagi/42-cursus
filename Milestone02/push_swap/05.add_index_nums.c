/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   05.add_index_nums.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/24 15:41:54 by ktakeru           #+#    #+#             */
/*   Updated: 2025/06/24 18:44:34 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "stack.h"

int	*stack_to_array(t_stack *stack, int size)
{
	int	*arr;
	int	i;

	arr = malloc(sizeof(int) * size);
	if (!arr)
		exit_error();
	i = 0;
	while (stack)
	{
		arr[i] = stack->value;
		stack = stack->next;
		i++;
	}
	return (arr);
}

void	sort_array(int *arr, int size)
{
	int	i;
	int	j;
	int	temp;

	i = 0;
	while (i < size - 1)
	{
		j = 0;
		while (j < size - i - 1)
		{
			if (arr[j] > arr[j + 1])
			{
				temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
			j++;
		}
		i++;
	}
}

void	set_index(t_stack *stack)
{
	int		*arr;
	int		size;
	t_stack	*temp;
	int		i;

	size = stack_size(stack);
	arr = stack_to_array(stack, size);
	sort_array(arr, size);
	temp = stack;
	while (temp)
	{
		i = 0;
		while (i < size)
		{
			if (temp->value == arr[i])
			{
				temp->index = i;
				break ;
			}
			i++;
		}
		temp = temp->next;
	}
	free(arr);
}
