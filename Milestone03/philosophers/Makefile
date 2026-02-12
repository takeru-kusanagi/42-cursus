# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/09/16 19:54:42 by ktakeru           #+#    #+#              #
#    Updated: 2025/09/18 18:53:27 by ktakeru          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

CC				= gcc
CFLAGS			= -Wall -Wextra -Werror
NAME			= philo

SRCS			=	01_philo.c \
					02_validate_and_parse_args.c \
					03_init_philos.c \
					04_01_simulation.c \
					04_02_01_philo_routine.c \
					04_02_02_philo_routine.c \
					04_03_monitor_routine.c \
					05_cleanup.c \

OBJS			= $(SRCS:.c=.o)

HDRS			= ./includes/philo.h

all: $(NAME)

$(NAME): $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o $(NAME)

%.o: %.c $(HDRS)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
