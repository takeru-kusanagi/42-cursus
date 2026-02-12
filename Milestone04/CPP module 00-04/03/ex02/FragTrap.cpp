
#include "FragTrap.hpp"

#include <string>
#include <iostream>

FragTrap::FragTrap() : ClapTrap("Default"){
	this->_hitPoints = 100;
	this->_energyPoints = 100;
	this->_attackDamage = 30;

	std::cout << "FragTrap (Default Construct) " << this->_name << " is **CONSTRUCTED** with high stats!"
              << " (HP:100, EP:100, AD:30)" << std::endl;
}

FragTrap::FragTrap(const std::string& name) : ClapTrap(name){
	this->_hitPoints = 100;
	this->_energyPoints = 100;
	this->_attackDamage = 30;

	std::cout << "FragTrap " << this->_name << " is **CONSTRUCTED** with high stats!"
              << " (HP:100, EP:100, AD:30)" << std::endl;
}

FragTrap::FragTrap(const FragTrap& other) : ClapTrap(other){
	std::cout << "FragTrap " << this->_name << " is **COPY CONSTRUCTED**." << std::endl;
}

FragTrap& FragTrap::operator=(const FragTrap& other){
	if(this != &other){
		ClapTrap::operator=(other);
		std::cout << "FragTrap " << this->_name << " is **ASSIGNED**." << std::endl;
	}
	return *this;
}

FragTrap::~FragTrap(){
	std::cout << "FragTrap " << this->_name << " is **DESTRUCTED**." << std::endl;
}

void FragTrap::highFivesGuys(void) {
    std::cout << "FragTrap " << this->_name << " requests a **positive high-fives**, guys! Give me five!" << std::endl;
}
