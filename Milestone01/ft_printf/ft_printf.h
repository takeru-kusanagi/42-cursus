/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_printf.h                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/09 13:53:10 by ktakeru           #+#    #+#             */
/*   Updated: 2025/05/14 20:58:02 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FT_PRINTF_H
# define FT_PRINTF_H

# include <stdarg.h>
# include <stdint.h>
# include <stdlib.h>
# include <unistd.h>

int	ft_printf(const char *format, ...);
int	handle_conversion(char c, va_list args);
int	ft_putchar(char c);
int	ft_putstr(char *s);
int	ft_print_ptr(void *ptr);
int	ft_putnbr(int n);
int	ft_print_unsigned(unsigned int n);
int	ft_print_hex(unsigned int num, char c);

#endif
