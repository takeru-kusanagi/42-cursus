/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cub3d.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/28 19:51:58 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 21:12:57 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CUB3D_H
# define CUB3D_H

# include "mlx.h"
# include <fcntl.h>
# include <math.h>
# include <stdio.h>
# include <stdlib.h>
# include <sys/time.h>
# include <unistd.h>

# define KEY_PRESS 2
# define KEY_RELEASE 3
# define CLOSE_WINDOW 17

# define KEY_PRESS_MASK 1
# define KEY_RELEASE_MASK 2

# define ESC 65307
# define RIGHT 65363
# define LEFT 65361
# define W 119
# define A 97
# define S 115
# define D 100

# define MOVE_SPEED 2
# define ROTATE_SPEED 1.5

# define TEX_SIZE 32

# ifndef BUFFER_SIZE
#  define BUFFER_SIZE 4096
# endif

typedef struct s_file_data
{
	char		**lines;
	int			line_count;
}				t_file_data;

typedef struct s_img
{
	void		*img;
	char		*addr;
	int			bpp;
	int			line_len;
	int			endian;
}				t_img;

typedef struct s_world
{
	char		**map;
	int			w;
	int			h;
}				t_world;

typedef struct s_tex
{
	void		*img;
	char		*addr;
	int			bpp;
	int			line_len;
	int			endian;
	int			width;
	int			height;
}				t_tex;

typedef struct s_params
{
	char		*north_tex_path;
	char		*south_tex_path;
	char		*west_tex_path;
	char		*east_tex_path;
	int			floor_color;
	int			ceiling_color;
	int			first_map_line;
	int			config_count;
	char		**map;
	int			map_height;
	int			map_width;
	int			player_start_x;
	int			player_start_y;
	char		player_direction;
	int			player_count;
	char		**temp_map_for_cleanup;
	t_file_data	*file_data_for_cleanup;
}				t_params;

typedef struct s_raycast
{
	double		ray_dir_x;
	double		ray_dir_y;
	int			map_x;
	int			map_y;
	double		delta_dist_x;
	double		delta_dist_y;
	double		side_dist_x;
	double		side_dist_y;
	int			step_x;
	int			step_y;
	double		perp_wall_dist;
	int			side;
	int			tex_index;
	double		wall_x;
	int			tex_x;
	int			hit;
}				t_raycast;

typedef struct s_game
{
	void		*mlx;
	void		*win;
	int			win_w;
	int			win_h;
	t_img		frame;
	int			key_right;
	int			key_left;
	int			key_w;
	int			key_a;
	int			key_s;
	int			key_d;
	double		pos_x;
	double		pos_y;
	double		dir_x;
	double		dir_y;
	double		plane_x;
	double		plane_y;
	double		rot_speed;
	int			color_floor;
	int			color_ceil;
	t_world		world;
	double		move_speed;
	t_params	*params;
	t_tex		textures[4];
}				t_game;

typedef struct s_draw_params
{
	int			line_height;
	int			draw_start;
	int			draw_end;
	double		tex_step;
	double		tex_pos;
	t_tex		*tex;
}				t_draw_params;

/* main */
int				main(int ac, char **av);

/* parser */
// read file
t_file_data		*read_file_to_list(const char *filename);
void			read_lines_into_data(t_file_data *data, int fd);
// config
const char		*ft_strtrim_start(const char *s);
t_params		*parse_config(t_file_data *file_data);
void			parse_color(t_params *p, t_file_data *f_data,
					const char *line_start, int *color_ptr);
int				is_valid_number_string(char *s);
// parse_map
int				parse_map(t_file_data *file_data, t_params *params);
void			validate_map_content(t_params *p, t_file_data *f_data);
void			validate_map_closure(t_params *params, t_file_data *f_data);
char			*ft_strdup_without_newline(const char *s);
char			**duplicate_map(char **map, int height, t_params *p,
					t_file_data *f_data);

/* init */
void			my_mlx_pixel_put(t_img *data, int x, int y, int color);
int				mlx_setup(t_game *game);
int				load_textures(t_game *game);
int				ft_isspace(const char s);

/* hook */
int				install_hooks(t_game *game);
int				on_close(void *param);
int				loop_tick(void *param);

/* render */
void			init_camera(t_game *game, int player_start_x,
					int player_start_y, char player_direction);
void			draw_wall_slice(int x, t_game *game, t_raycast *ray);
void			init_ray(int x, t_game *game, t_raycast *ray);
void			cast_rays(t_game *game);
void			calculate_distance_and_texture(t_game *game, t_raycast *ray);
void			perform_dda(t_game *game, t_raycast *ray);

/* game */
void			update_move(t_game *game, double dt);
void			update_rotate(t_game *game, double dt);

/* utils */
// free
void			ft_free_split(char **strs);
void			free_temp_map(char **map);
void			free_params(t_params *params);
void			free_file_data(t_file_data *file_data);
void			free_mlx_data(t_game *game);
// error
void			exit_with_cleanup(t_file_data *file_data, t_params *params,
					const char *msg);
// GNL
char			*get_next_line(int fd);
// ft_functions
int				ft_strncmp(const char *s1, const char *s2, size_t n);
char			*ft_strstr(const char *haystack, const char *needle);
// libft
size_t			ft_strlen(const char *s);
char			*ft_strdup(const char *s);
char			*ft_strchr(const char *s, int c);
char			*ft_strjoin(char const *s1, char const *s2);
void			ft_bzero(void *s, size_t n);
int				ft_isdigit(int c);
int				ft_atoi(const char *str);
char			**ft_split(char const *s, char c);
void			*ft_memset(void *s, int c, size_t n);
void			*ft_memcpy(void *dest, const void *src, size_t n);
size_t			ft_strlcpy(char *dst, const char *src, size_t size);

#endif
