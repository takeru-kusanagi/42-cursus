
#include "Animal.hpp"
#include "Dog.hpp"
#include "Cat.hpp"
#include "WrongAnimal.hpp"
#include "WrongCat.hpp"
#include "Brain.hpp"

#include <iostream>

void test_array_destruction() {
    std::cout << "--- 1. POLYMORPHIC ARRAY TEST ---" << std::endl;

    const int array_size = 4;
    Animal* zoo[array_size];

    for (int i = 0; i < array_size / 2; ++i) {
        zoo[i] = new Dog();
    }
    for (int i = array_size / 2; i < array_size; ++i) {
        zoo[i] = new Cat();
    }

    std::cout << "\n--- Array Deletion Start ---\n";
    for (int i = 0; i < array_size; ++i) {
        std::cout << "Deleting object " << i << ":" << std::endl;
        delete zoo[i];
    }
    std::cout << "--- Array Deletion End ---\n" << std::endl;
}

void test_deep_copy() {
    std::cout << "--- 2. DEEP COPY TEST (Brain Independence) ---" << std::endl;

    Dog original;
    original.setIdea(0, "I am Original's idea");
    Dog copied = original;
    copied.setIdea(0, "I am Copied's idea, changed.");

    std::cout << "\nOriginal Dog's Idea (Expected: I am Original's idea): "
              << original.getIdea(0) << std::endl;
    std::cout << "Copied Dog's Idea (Expected: I am Copied's idea, changed.): "
              << copied.getIdea(0) << std::endl;

    std::cout << "--- DEEP COPY TEST END ---" << std::endl << std::endl;
}

int main() {
    test_array_destruction();
    test_deep_copy();

    return 0;
}
