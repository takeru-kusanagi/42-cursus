# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/15 21:45:39 by ktakeru           #+#    #+#              #
#    Updated: 2025/07/17 18:37:29 by ktakeru          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = pipex

CC = cc
CFLAGS = -Wall -Wextra -Werror

SRCS = 01_main.c 02_child_processes.c 03_cmd_functions.c 99_error.c
OBJS = $(SRCS:.c=.o)

HEADERS = pipex.h

LIBFT_DIR = ./libft
LIBFT = $(LIBFT_DIR)/libft.a
LIBFT_INC = -I$(LIBFT_DIR)

all: $(LIBFT) $(NAME)

$(LIBFT):
	make -C $(LIBFT_DIR) re

$(NAME): $(OBJS)
	$(CC) $(CFLAGS) -I. $(LIBFT_INC) -o $(NAME) $(OBJS) $(LIBFT)

%.o: %.c $(HEADERS)
	$(CC) $(CFLAGS) -I. $(LIBFT_INC) -c $< -o $@

clean:
	make clean -C $(LIBFT_DIR)
	rm -f $(OBJS)

fclean: clean
	make fclean -C $(LIBFT_DIR)
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
