#include "Base.hpp"

Base * generate(void) {
    static bool seeded = false;
    if (!seeded) {
        std::srand(std::time(0));
        seeded = true;
    }
    int random_choice = std::rand() % 3;
    switch (random_choice) {
        case 0:
            std::cout << "Generated: A -> ";
            return new A();
        case 1:
            std::cout << "Generated: B -> ";
            return new B();
        case 2:
            std::cout << "Generated: C -> ";
            return new C();
        default:
            return NULL;
    }
}

void identify(Base* p) {
    if (!p) {
        std::cout << "NULL" << std::endl;
        return;
    }
    if (dynamic_cast<A*>(p)) {
        std::cout << "Identify (Pointer): A" << std::endl;
    } else if (dynamic_cast<B*>(p)) {
        std::cout << "Identify (Pointer): B" << std::endl;
    } else if (dynamic_cast<C*>(p)) {
        std::cout << "Identify (Pointer): C" << std::endl;
    } else {
        std::cout << "Identify (Pointer): Unknown type" << std::endl;
    }
}

void identify(Base& p) {
    std::cout << "Identify (Reference): ";

    try {
        (void)dynamic_cast<A&>(p);
        std::cout << "A" << std::endl;
        return;
    } catch (const std::exception& e) {}

    try {
        (void)dynamic_cast<B&>(p);
        std::cout << "B" << std::endl;
        return;
    } catch (const std::exception& e) {}

    try {
        (void)dynamic_cast<C&>(p);
        std::cout << "C" << std::endl;
        return;
    } catch (const std::exception& e) {
        std::cout << "Unknown type" << std::endl;
    }
}
