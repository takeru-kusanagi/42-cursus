
#include "Zombie.hpp"
#include <string>

void randomChump(std::string name){

	Zombie randomZombie(name);
	randomZombie.announce();
}
