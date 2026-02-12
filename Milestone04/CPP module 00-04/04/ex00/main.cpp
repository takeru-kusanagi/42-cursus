
#include "Animal.hpp"
#include "Dog.hpp"
#include "Cat.hpp"
#include "WrongAnimal.hpp"
#include "WrongCat.hpp"

#include <iostream>

void test_mandatory() {
    std::cout << "--- 1. MANDATORY TEST (Virtual Function) ---" << std::endl;

    const Animal* meta = new Animal();
    const Animal* j = new Dog();
    const Animal* i = new Cat();

    std::cout << "j's type: " << j->getType() << std::endl;
    std::cout << "i's type: " << i->getType() << std::endl;

    std::cout << "Cat sound (i->makeSound()): ";
    i->makeSound();
    std::cout << "Dog sound (j->makeSound()): ";
    j->makeSound();
    std::cout << "Animal sound (meta->makeSound()): ";
    meta->makeSound();

    delete meta;
    delete j;
    delete i;
    std::cout << "--- MANDATORY TEST END ---" << std::endl << std::endl;
}

void test_wrong_classes() {
    std::cout << "--- 2. WRONG CLASSES TEST (Non-Virtual Function) ---" << std::endl;

    const WrongAnimal* wrongMeta = new WrongAnimal();
    const WrongAnimal* wrongI = new WrongCat();

    std::cout << "wrongI's type: " << wrongI->getType() << std::endl;
    std::cout << "wrongMeta's type: " << wrongMeta->getType() << std::endl;

    std::cout << "WrongCat sound (wrongI->makeSound()): ";
    wrongI->makeSound();
    std::cout << "WrongAnimal sound (wrongMeta->makeSound()): ";
    wrongMeta->makeSound();

    delete wrongMeta;
    delete wrongI;
    std::cout << "--- WRONG CLASSES TEST END ---" << std::endl << std::endl;
}

void test_extra_deep() {
    std::cout << "--- 3. EXTRA TEST: Array and Plain Objects ---" << std::endl;

    Animal* zoo[4];
    zoo[0] = new Dog();
    zoo[1] = new Cat();
    zoo[2] = new Dog();
    zoo[3] = new Cat();

    for (int k = 0; k < 4; ++k) {
        std::cout << "[" << k << "] " << zoo[k]->getType() << " says: ";
        zoo[k]->makeSound();
    }

    for (int k = 0; k < 4; ++k) {
        delete zoo[k];
    }
    std::cout << "--- EXTRA TEST END ---" << std::endl;
}

int main() {
    test_mandatory();
    test_wrong_classes();
    test_extra_deep();
    return 0;
}
