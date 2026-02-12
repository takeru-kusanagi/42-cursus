# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/10/23 16:05:12 by ktakeru           #+#    #+#              #
#    Updated: 2025/10/29 18:26:40 by ktakeru          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME      = cub3D
CC        = cc
CFLAGS    = -g3 -O0 -Wall -Wextra -Werror -I include -I minilibx-linux

SRC_DIR   = src
OBJ_DIR   = obj

MLX_DIR = minilibx-linux
MLX_A = $(MLX_DIR)/libmlx.a
MLX_A_ALT = $(MLX_DIR)/libmlx_Linux.a
MLX_FLAGS = -L $(MLX_DIR) -lmlx -lXext -lX11 -lm -lz

LIBFT_DIR = libft
LIBFT_A   = $(LIBFT_DIR)/libft.a
LIBFT_FLAGS = -L $(LIBFT_DIR) -lft

SRC = $(SRC_DIR)/main.c \
      $(SRC_DIR)/init/mlx_setup.c \
	  $(SRC_DIR)/init/mlx_setup2.c \
      $(SRC_DIR)/hook/hook.c \
      $(SRC_DIR)/hook/loop.c \
	  $(SRC_DIR)/render/camera.c \
	  $(SRC_DIR)/render/draw.c \
	  $(SRC_DIR)/render/raycast.c \
	  $(SRC_DIR)/render/raycast2.c \
	  $(SRC_DIR)/game/move.c\
	  $(SRC_DIR)/game/rotate.c\
	  $(SRC_DIR)/parser/01_01_read_file.c \
	  $(SRC_DIR)/parser/01_02_read_file.c \
	  $(SRC_DIR)/parser/02_01_config_parser.c\
	  $(SRC_DIR)/parser/02_02_config_parser.c\
	  $(SRC_DIR)/parser/02_03_config_utils.c\
	  $(SRC_DIR)/parser/03_01_map_parser.c\
	  $(SRC_DIR)/parser/03_02_map_validation.c\
	  $(SRC_DIR)/parser/03_03_map_closure.c\
	  $(SRC_DIR)/parser/03_04_utils.c\
	  $(SRC_DIR)/utils/error.c\
	  $(SRC_DIR)/utils/free1.c\
	  $(SRC_DIR)/utils/free2.c\
	  $(SRC_DIR)/utils/ft_functions_utils.c\
	  $(SRC_DIR)/utils/gnl.c\

OBJ = $(SRC:$(SRC_DIR)/%.c=$(OBJ_DIR)/%.o)

all: $(MLX_A) $(LIBFT_A) $(NAME)

$(NAME): $(OBJ) $(MLX_A) $(LIBFT_A)
	$(CC) $(CFLAGS) $(OBJ) $(LIBFT_FLAGS) $(MLX_FLAGS) -o $(NAME)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
	mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

$(MLX_A):
	$(MAKE) -C $(MLX_DIR)

$(LIBFT_A):
	$(MAKE) -C $(LIBFT_DIR)

clean:
	rm -rf $(OBJ_DIR)
	$(MAKE) clean -C $(MLX_DIR)
	$(MAKE) clean -C $(LIBFT_DIR)

fclean: clean
	rm -f $(NAME)
	rm -f $(MLX_A) $(MLX_A_ALT)
	$(MAKE) fclean -C $(LIBFT_DIR)

re: fclean all

.PHONY: all clean fclean re
