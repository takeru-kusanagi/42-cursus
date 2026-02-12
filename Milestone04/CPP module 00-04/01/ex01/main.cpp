
#include "Zombie.hpp"

#include <string>
#include <iostream>
#include <cstdlib>

Zombie* zombieHorde( int N, std::string name );

int main(int ac, char **av){
	if(ac != 2)
		return 1;
	int horde_size = std::atoi(av[1]);
	if(horde_size > 1000){
		std::cerr << "Zombie Horde got so big...! We can't handle those many Zombies...!" << std::endl;
		return 1;
	}
	std::string horde_member = "Horde_member";
	Zombie *horde = NULL;
	std::cout << "--- Creating Zombie Horde (" << horde_size << " members) ---" << std::endl;
	horde = zombieHorde(horde_size, horde_member);
	if(horde){
		std::cout << "\n--- Announcing Horde Members ---" << std::endl;
		for(int i = 0; i < horde_size; ++i){
			horde[i].announce();
		}
		std::cout << "\n--- Deleting Zombie Horde ---" << std::endl;
        delete[] horde;
	}else{
		std::cout << "Horde creation failed (N was 0 or negative)." << std::endl;
	}
	std::cout << "\n--- Test finished ---" << std::endl;
    return 0;
}
