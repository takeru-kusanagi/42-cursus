/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mlx_setup2.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sykawai <sykawai@student.42tokyo.jp>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/10/29 01:02:33 by sykawai           #+#    #+#             */
/*   Updated: 2025/10/29 01:02:33 by sykawai          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

static int	load_textures_internal(t_game *game, char *paths[4])
{
	int		i;
	t_tex	*tex;

	i = 0;
	while (i < 4)
	{
		tex = &game->textures[i];
		tex->img = mlx_xpm_file_to_image(game->mlx, paths[i], &tex->width,
				&tex->height);
		if (!tex->img)
			exit_with_cleanup(NULL, game->params,
				"Failed to load texture (mlx_xpm_file_to_image).");
		tex->addr = mlx_get_data_addr(tex->img, &tex->bpp, &tex->line_len,
				&tex->endian);
		if (!tex->addr)
			exit_with_cleanup(NULL, game->params,
				"Failed to get texture data addr.");
		if (tex->width == 0 || tex->height == 0)
			exit_with_cleanup(NULL, game->params, "Texture size is 0.");
		i++;
	}
	return (0);
}

int	load_textures(t_game *game)
{
	char	*paths[4];

	paths[0] = game->params->north_tex_path;
	paths[1] = game->params->south_tex_path;
	paths[2] = game->params->west_tex_path;
	paths[3] = game->params->east_tex_path;
	return (load_textures_internal(game, paths));
}
