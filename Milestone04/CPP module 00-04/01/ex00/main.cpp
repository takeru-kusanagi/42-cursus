
#include "Zombie.hpp"
#include <string>
#include <iostream>

Zombie* newZombie(std::string name);
void randomChump(std::string name);

int main(){

	std::cout << "--- Testing randomChump (Stack) ---" << std::endl;
	randomChump("Stack_Zombie_01");
	std::cout << "\n--- Testing newZombie (Heap) ---" << std::endl;
	Zombie* heapZombie = newZombie("Stack_Zombie_02");
	heapZombie->announce();
	delete heapZombie;
	std::cout << "\n--- Main function finished ---" << std::endl;
    return 0;
}
