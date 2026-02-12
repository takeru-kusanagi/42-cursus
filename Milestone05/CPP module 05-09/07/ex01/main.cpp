
#include <iostream>
#include <string>

#include "iter.hpp"

void printSeparator(const std::string& title) {
    std::cout << "\n--- " << title << " ---" << std::endl;
}

int main() {

    printSeparator("1. Integer Array Test");
    int intArray[] = {1, 2, 3, 4, 5};
    std::size_t intLen = sizeof(intArray) / sizeof(intArray[0]);

    std::cout << "Initial values: ";
    iter(intArray, intLen, displayElement<int>);
    std::cout << std::endl;

    std::cout << "Doubling values... ";
    iter(intArray, intLen, doubleValue<int>);

    std::cout << "\nAfter change: ";
    iter(intArray, intLen, displayElement<int>);
    std::cout << std::endl;

    printSeparator("2. String Array Test");
    std::string strArray[] = {"Hello", "World", "C++98"};
    std::size_t strLen = sizeof(strArray) / sizeof(strArray[0]);

    std::cout << "Elements: ";
    iter(strArray, strLen, displayElement<std::string>);
    std::cout << "\n" << std::endl;

    return 0;
}
