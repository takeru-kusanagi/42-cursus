# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/06/27 18:48:31 by ktakeru           #+#    #+#              #
#    Updated: 2025/07/07 18:41:30 by ktakeru          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = so_long

CC = cc
CFLAGS = -Wall -Wextra -Werror

SRC_DIR = src
GNL_DIR = get_next_line
LIBFT_DIR = libft
MLX_DIR = minilibx-linux

SRCS = $(SRC_DIR)/01.main.c \
		$(SRC_DIR)/02.read_map.c \
		$(SRC_DIR)/02.validate_map.c \
		$(SRC_DIR)/02.validate_map_utils.c \
		$(SRC_DIR)/03.init_game.c \
		$(SRC_DIR)/04.validate_path.c \
		$(SRC_DIR)/04.validate_path2.c \
		$(SRC_DIR)/05.draw_map.c \
		$(SRC_DIR)/06.key_press.c \
		$(SRC_DIR)/07.move_player.c \
		$(SRC_DIR)/99.exit_free.c

OBJS = $(SRCS:.c=.o)

LIBFT = $(LIBFT_DIR)/libft.a
MLX = -L$(MLX_DIR) -lmlx -lXext -lX11 -lm

INCLUDES = -Iinclude -I$(GNL_DIR) -I$(LIBFT_DIR) -I$(MLX_DIR)

all: $(NAME)

$(NAME): $(LIBFT) $(OBJS)
	$(CC) $(CFLAGS) $(INCLUDES) $(OBJS) $(LIBFT) $(MLX) -o $(NAME)

$(LIBFT):
	make -C $(LIBFT_DIR)

%.o: %.c
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@

clean:
	make clean -C $(LIBFT_DIR)
	rm -f $(OBJS)

fclean: clean
	make fclean -C $(LIBFT_DIR)
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
