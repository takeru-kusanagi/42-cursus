
#include "ClapTrap.hpp"
#include "ScavTrap.hpp"

#include <iostream>
#include <string>

void scav_trap_test() {
    std::cout << "\n==========================================" << std::endl;
    std::cout << "             SCAVTRAP TEST                " << std::endl;
    std::cout << "==========================================" << std::endl;

    ScavTrap serena("Serena");

    std::cout << "\n--- Actions Check (EP: 50) ---" << std::endl;

    serena.attack("Bandit");
    serena.takeDamage(15);
    serena.beRepaired(10);
    serena.guardGate();
    std::cout << "\n--- EP Exhaustion Check ---" << std::endl;
    for (int i = 0; i < 48; ++i) {
        serena.attack("Zom-Zom");
    }
    serena.attack("Final Zom");
}

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

    scav_trap_test();

    return 0;
}
