
#include "ClapTrap.hpp"

#include <iostream>
#include <string>

int main() {

    std::cout << "\n==========================================" << std::endl;
    std::cout << "             CLAPTRAP TEST                " << std::endl;
    std::cout << "==========================================" << std::endl;


    ClapTrap Clement("Clement");
    Clement.attack("robot factory");
    Clement.takeDamage(5);
    Clement.beRepaired(3);

    std::cout << "--- Testing Death and No Energy ---" << std::endl;

    ClapTrap Flo("Flo");
    Flo.takeDamage(10);
    Flo.attack("a fly");

    ClapTrap Yuriko("Yuriko");
    for (int i = 0; i < 11; ++i) {
        Yuriko.attack("a rock");
    }
    Yuriko.beRepaired(1);

    return 0;
}
