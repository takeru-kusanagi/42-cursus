
#include "ScavTrap.hpp"

#include <iostream>
#include <string>

ScavTrap::ScavTrap() : ClapTrap("Default")
{
    this->_hitPoints = 100;
    this->_energyPoints = 50;
    this->_attackDamage = 20;

    std::cout << "ScavTrap Default Constructor Called (Name: "
              << this->_name << ", HP: " << this->_hitPoints << ")" << std::endl;
}

ScavTrap::ScavTrap(const std::string& name) : ClapTrap(name) {
    this->_hitPoints = 100;
    this->_energyPoints = 50;
    this->_attackDamage = 20;

    std::cout << "ScavTrap " << this->_name << " is **CONSTRUCTED** and ready to guard! (HP:100, EP:50, AD:20)" << std::endl;
}

ScavTrap::ScavTrap(const ScavTrap& other) : ClapTrap(other) {
    std::cout << "ScavTrap " << this->_name << " is **COPY CONSTRUCTED**." << std::endl;
}

ScavTrap& ScavTrap::operator=(const ScavTrap& other) {
    if (this != &other) {
        ClapTrap::operator=(other);
        std::cout << "ScavTrap " << this->_name << " is **ASSIGNED**." << std::endl;
    }
    return *this;
}

ScavTrap::~ScavTrap() {
    std::cout << "ScavTrap " << this->_name << " is **DESTRUCTED**." << std::endl;
}

void ScavTrap::attack(const std::string& target) {
    if (this->_hitPoints == 0 || this->_energyPoints == 0) {
        std::cout << "ScavTrap " << this->_name << " cannot attack (HP or EP exhausted)." << std::endl;
        return;
    }
    this->_energyPoints--;

    std::cout << "ScavTrap " << this->_name << " **fiercely attacks** " << target
              << ", causing " << this->_attackDamage << " points of Scav-damage! (EP left: "
              << this->_energyPoints << ")" << std::endl;
}

void ScavTrap::guardGate() {
    std::cout << "ScavTrap " << this->_name << " has entered **Gate keeper mode**! (All shall pass... eventually.)" << std::endl;
}
