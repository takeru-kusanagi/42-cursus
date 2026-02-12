
#include "ClapTrap.hpp"

#include <iostream>
#include <string>
#include <limits>

ClapTrap::ClapTrap() :
    _name("Default"),
    _hitPoints(10),
    _energyPoints(10),
    _attackDamage(0)
{
    std::cout << "Default Constructor Called" << std::endl;
}


ClapTrap::ClapTrap(const std::string& name) :
	_name(name),
	_hitPoints(10),
	_energyPoints(10),
	_attackDamage(0)
{
	std::cout << "ClapTrap " << _name << " is **CONSTRUCTED**!" << std::endl;
}

ClapTrap::ClapTrap(const ClapTrap& other) :
    _name(other._name),
    _hitPoints(other._hitPoints),
    _energyPoints(other._energyPoints),
    _attackDamage(other._attackDamage)
{
    std::cout << "ClapTrap " << _name << " is **COPY CONSTRUCTED** from "
              << other._name << "!" << std::endl;
}

ClapTrap& ClapTrap::operator=(const ClapTrap& other) {
    if (this != &other) {
        this->_name = other._name;
        this->_hitPoints = other._hitPoints;
        this->_energyPoints = other._energyPoints;
        this->_attackDamage = other._attackDamage;
    }
    std::cout << "ClapTrap " << this->_name << " is **ASSIGNED**!" << std::endl;
    return *this;
}

ClapTrap::~ClapTrap(){
	std::cout << "ClapTrap " << _name << " is **DESTRUCTED**!" << std::endl;
}

void ClapTrap::attack(const std::string& target){
	if (_hitPoints == 0) {
        std::cout << "ClapTrap " << _name << " is **too damaged** to attack!" << std::endl;
        return;
    }
    if (_energyPoints == 0) {
        std::cout << "ClapTrap " << _name << " has **no energy points** left to attack!" << std::endl;
        return;
    }
	_energyPoints--;
	std::cout << "ClapTrap " << _name << " attacks " << target
              << ", causing " << _attackDamage << " points of damage!" << std::endl;
}

void ClapTrap::takeDamage(unsigned int amount) {
    std::cout << "ClapTrap " << _name << " is **attacked** and takes "
              << amount << " points of damage!" << std::endl;
    if (_hitPoints > 0) {
        if (amount >= _hitPoints) {
            _hitPoints = 0;
            std::cout << _name << " has been **defeated**!" << std::endl;
        } else {
            _hitPoints -= amount;
        }
    } else {
        std::cout << _name << " is **already defeated** and cannot take more damage." << std::endl;
    }
}

void ClapTrap::beRepaired(unsigned int amount) {
    if (_hitPoints > std::numeric_limits<unsigned int>::max() - amount) {
        std::cout << "ClapTrap " << _name << " **cannot be fully repaired** (Hit Points overflow avoided)!" << std::endl;
        _hitPoints = std::numeric_limits<unsigned int>::max();
    }
    if (_hitPoints == 0) {
        std::cout << "ClapTrap " << _name << " is **defeated** and cannot repair itself!" << std::endl;
        return;
    }
    if (_energyPoints == 0) {
        std::cout << "ClapTrap " << _name << " has **no energy points** left to repair!" << std::endl;
        return;
    }
    _energyPoints--;
    _hitPoints += amount;
    std::cout << "ClapTrap " << _name << " **repairs itself** for "
              << amount << " hit points. Current HP: " << _hitPoints << std::endl;
}
