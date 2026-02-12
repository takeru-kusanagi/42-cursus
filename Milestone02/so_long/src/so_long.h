/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   so_long.h                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/02 22:31:54 by ktakeru           #+#    #+#             */
/*   Updated: 2025/07/07 18:46:55 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SO_LONG_H
# define SO_LONG_H

# include "get_next_line.h"
# include "libft.h"
# include "mlx.h"
# include <fcntl.h>
# include <stdio.h>
# include <stdlib.h>
# include <unistd.h>

typedef struct s_counts
{
	int		player;
	int		exit;
	int		collect;
}			t_counts;

typedef struct s_game
{
	void	*mlx;
	void	*win;
	void	*img_wall;
	void	*img_floor;
	void	*img_player;
	void	*img_exit;
	void	*img_collect;
	int		img_size;
	char	**map;
	int		map_width;
	int		map_height;
	int		player_x;
	int		player_y;
	int		collect_count;
	int		collect_found;
	int		move_count;
}			t_game;

// 01 main
int			get_line_count(char **map);
int			get_line_length(char *line);
int			main(void);
// 02 read_map
char		**expand_map(char **map, int old_cap, int new_cap);
char		**convert_to_map(char **map, int fd, int capacity);
char		**read_map(char *filename);
// 02 validate map_utils
int			is_wall(char c);
void		check_border(t_game *game, int i, int j);
void		check_characters(char c, t_counts *counts, char **map);
// 02 validate map
void		validate_map2(t_game *game, t_counts *counts);
void		validate_map(t_game *game);
// 03 init_game
void		load_images2(t_game *game, char **map);
void		load_images1(t_game *game, char **map);
void		initialize_game(t_game *game, char **map);
void		init_game(t_game *game, char **map);
// 04 validate path
char		**copy_map(char **map);
void		validate_path(t_game *game);
// 04 validate path2
void		flood_fill_collectibles(char **map, int x, int y, t_game *game);
void		flood_fill_exit(char **map, int x, int y, t_game *game);
// 05 draw_map
void		put_image(t_game *game, void *img, int x, int y);
void		draw_map(t_game *game);
// 06 key press
int			key_press(int keycode, t_game *game);
// 07 move player
int			whats_on_the_next_cell(t_game *game, int new_y, int new_x);
void		move_player(t_game *game, int dx, int dy);
// 99 exit free
void		exit_game(t_game *game);
void		free_map(char **map);
void		exit_error(char *msg);

#endif
