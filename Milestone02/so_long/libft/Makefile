# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/05/12 13:58:19 by ktakeru           #+#    #+#              #
#    Updated: 2025/07/03 16:06:59 by ktakeru          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

CC = cc
CFLAGS = -Wall -Wextra -Werror

SRCS =  ft_printf.c \
        ft_print_hex.c \
        ft_print_ptr.c \
        ft_print_unsigned.c \
        ft_print_utils.c \
		get_next_line.c \
		get_next_line_utils.c \
        ft_isalnum.c ft_isprint.c ft_memcmp.c ft_putchar_fd.c ft_split.c \
        ft_strlcat.c ft_strncmp.c ft_substr.c ft_atoi.c ft_isalpha.c \
        ft_itoa.c ft_memcpy.c ft_putendl_fd.c ft_strchr.c ft_strlcpy.c \
        ft_strnstr.c ft_tolower.c ft_bzero.c ft_isascii.c ft_memmove.c \
        ft_putnbr_fd.c ft_strdup.c ft_strlen.c ft_strrchr.c ft_toupper.c \
        ft_calloc.c ft_isdigit.c ft_memchr.c ft_memset.c ft_putstr_fd.c \
        ft_strjoin.c ft_strmapi.c ft_strtrim.c ft_striteri.c \
        ft_lstadd_back.c ft_lstadd_front.c ft_lstclear.c ft_lstdelone.c \
        ft_lstiter.c ft_lstlast.c ft_lstnew.c ft_lstsize.c ft_lstmap.c

OBJS = $(SRCS:.c=.o)

NAME = libft.a

all: $(NAME)

$(NAME): $(OBJS)
	ar rcs $(NAME) $(OBJS)

clean:
	rm -f $(OBJS)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
