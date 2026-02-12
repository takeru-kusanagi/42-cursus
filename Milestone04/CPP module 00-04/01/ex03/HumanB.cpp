
#include "HumanB.hpp"

HumanB::HumanB(std::string name) :
    _name(name),
    _weapon(NULL) {
}

void HumanB::setWeapon(Weapon& weapon) {
    this->_weapon = &weapon;
}

void HumanB::attack() {
    std::cout << this->_name;
    if (this->_weapon) {
        std::cout << " attacks with their " << this->_weapon->getType() << std::endl;
    } else {
        std::cout << " is defenseless and attempts to attack with bare hands!" << std::endl;
    }
}
