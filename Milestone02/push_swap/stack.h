/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stack.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/18 17:36:40 by ktakeru           #+#    #+#             */
/*   Updated: 2025/06/27 16:48:20 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef STACK_H
# define STACK_H

# include <limits.h>
# include <stdlib.h>
# include <unistd.h>

typedef struct s_stack
{
	int				value;
	int				index;
	struct s_stack	*next;
	struct s_stack	*prev;
}					t_stack;

// main
void				sort(t_stack **stack_a, t_stack **stack_b);
void				build_stack_from_args(t_stack **stack, char **args);
char				**ft_split(char const *s, char c);
int					main(int ac, char **av);
// utils01
void				add_back(t_stack **stack, t_stack *new_node);
t_stack				*new_node(int data);
int					is_duplicate(t_stack *stack, int num);
long				ft_atol(char *num);
// utils02
int					is_sorted(t_stack *stack);
int					get_index(t_stack *stack, int value);
int					min_value(t_stack *stack);
int					stack_size(t_stack *stack);
// utils03 free
void				free_stack(t_stack **stack);
void				free_split(char **split);
// sort small
void				sort_three(t_stack **a);
void				sort_four(t_stack **a, t_stack **b);
void				sort_five(t_stack **a, t_stack **b);
// sort radix
int					get_max_bits(t_stack *stack);
void				radix_sort(t_stack **a, t_stack **b);
// add index
int					*stack_to_array(t_stack *stack, int size);
void				sort_array(int *arr, int size);
void				set_index(t_stack *stack);
// swap operations
void				swap(t_stack **stack);
void				sa(t_stack **a);
void				sb(t_stack **b);
void				ss(t_stack **a, t_stack **b);
// push operations
void				push(t_stack **from, t_stack **to);
void				pa(t_stack **a, t_stack **b);
void				pb(t_stack **a, t_stack **b);
// rotate operations
void				rotate(t_stack **stack);
void				ra(t_stack **a);
void				rb(t_stack **b);
void				rr(t_stack **a, t_stack **b);
// reverse_rotate operations
void				reverse_rotate(t_stack **stack);
void				rra(t_stack **a);
void				rrb(t_stack **b);
void				rrr(t_stack **a, t_stack **b);
// error
void				exit_error(void);

#endif
