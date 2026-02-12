/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+
	+:+     */
/*   By: ktakeru <ktakeru@student.42tokyo.jp>       +#+  +:+
	+#+        */
/*                                                +#+#+#+#+#+
	+#+           */
/*   Created: 2025/10/27 15:22:47 by ktakeru           #+#    #+#             */
/*   Updated: 2025/10/28 20:26:38 by ktakeru          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static t_params	*load_and_parse_map(int ac, char **av)
{
	t_file_data	*file_data;
	t_params	*params;

	file_data = NULL;
	params = NULL;
	if (ac != 2)
		exit_with_cleanup(file_data, params,
			"Usage: ./cub3d <path/to/map.cub>");
	file_data = read_file_to_list(av[1]);
	if (!file_data)
		exit_with_cleanup(file_data, params, "Failed to read map file.");
	params = parse_config(file_data);
	if (!params)
		exit_with_cleanup(file_data, params, "Configuration parsing failed.");
	if (!parse_map(file_data, params))
		exit_with_cleanup(file_data, params, "Map validation failed.");
	free_file_data(file_data);
	return (params);
}

static void	apply_params_to_game(t_game *game, t_params *params)
{
	game->params = params;
	game->color_ceil = params->ceiling_color;
	game->color_floor = params->floor_color;
	game->world.map = params->map;
	game->world.w = params->map_width;
	game->world.h = params->map_height;
	game->move_speed = MOVE_SPEED;
	game->rot_speed = ROTATE_SPEED;
}

static void	initialize_game(t_game *game, int ac, char **av)
{
	t_params	*params;

	params = load_and_parse_map(ac, av);
	apply_params_to_game(game, params);
}

static void	run_game_loop(t_game *game)
{
	if (mlx_setup(game))
	{
		free_mlx_data(game);
		exit_with_cleanup(NULL, game->params,
			"MLX setup or texture loading failed.");
	}
	init_camera(game, game->params->player_start_x,
		game->params->player_start_y, game->params->player_direction);
	install_hooks(game);
	mlx_loop(game->mlx);
}

int	main(int ac, char **av)
{
	t_game	game;

	ft_memset(&game, 0, sizeof(t_game));
	initialize_game(&game, ac, av);
	run_game_loop(&game);
	free_mlx_data(&game);
	free_params(game.params);
	return (0);
}
