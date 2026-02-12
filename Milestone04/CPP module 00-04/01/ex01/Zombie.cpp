
#include "Zombie.hpp"

#include <string>
#include <iostream>

Zombie::Zombie() : _name("Default"){
}

Zombie::~Zombie(){
	std::cout << this->_name << ": " << "Aaargh! (destroyed)" << std::endl;
}

void Zombie::announce(void){
	std::cout << this->_name << ": " << "BraiiiiiiinnnzzzZ..." << std::endl;
}

void Zombie::setName(std::string name){
	this->_name = name;
}
