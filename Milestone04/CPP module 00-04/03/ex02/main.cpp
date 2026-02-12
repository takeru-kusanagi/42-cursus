
#include "ClapTrap.hpp"
#include "ScavTrap.hpp"
#include "FragTrap.hpp"

#include <iostream>
#include <string>

void frag_trap_test() {
    std::cout << "\n==========================================" << std::endl;
    std::cout << "             FRAGTRAP TEST                " << std::endl;
    std::cout << "==========================================" << std::endl;

    FragTrap Takeru("Takeru");
    std::cout << "\n--- Actions Check (HP: 100, EP: 100) ---" << std::endl;

    Takeru.attack("Boss");
    Takeru.takeDamage(50);
    Takeru.beRepaired(10);
    Takeru.highFivesGuys();

    std::cout << "\n--- EP Exhaustion Check ---" << std::endl;
    for (int i = 0; i < 98; ++i) {
        Takeru.attack("Mook");
    }
    Takeru.attack("Last Mook");
}

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
    frag_trap_test();

    return 0;
}
