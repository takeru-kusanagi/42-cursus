
#include "Animal.hpp"
#include "Dog.hpp"
#include "Cat.hpp"
#include "WrongAnimal.hpp"
#include "WrongCat.hpp"
#include "Brain.hpp"

#include <iostream>

int main() {
    const int array_size = 4;
    Animal* zoo[array_size];


    for (int i = 0; i < array_size / 2; ++i) {
        zoo[i] = new Dog();
    }
    for (int i = array_size / 2; i < array_size; ++i) {
        zoo[i] = new Cat();
    }
    for (int i = 0; i < array_size; ++i) {
        delete zoo[i];
    }
    Dog original;
    {
        std::cout << "---test start---" << std::endl;
        Dog tmp = original;
        std::cout << "---test end---" << std::endl;
    }
    original.setIdea(0, "Original Idea");
    Dog copied = original;
    copied.setIdea(0, "Copied Idea");

    return 0;
}
