
#include "Harl.hpp"

#include <iostream>
#include <string>

int main() {
    Harl harl;

	std::cout << "========================================" << std::endl;
    std::cout << "         Harl's Complaint Tests         " << std::endl;
    std::cout << "========================================" << std::endl;

    std::cout << "\n--- TEST 1: DEBUG ---" << std::endl;
    harl.complain("DEBUG");

    std::cout << "--- TEST 2: INFO ---" << std::endl;
    harl.complain("INFO");

    std::cout << "--- TEST 3: WARNING ---" << std::endl;
    harl.complain("WARNING");

    std::cout << "--- TEST 4: ERROR ---" << std::endl;
    harl.complain("ERROR");

    std::cout << "\n--- TEST 5: INVALID LEVEL ---" << std::endl;
    harl.complain("FATAL");

    std::cout << "\n--- TEST 6: LOWERCASE LEVEL ---" << std::endl;
    harl.complain("error");

    std::cout << "\n========================================" << std::endl;
    std::cout << "           Tests Finished             " << std::endl;
    return 0;
}
