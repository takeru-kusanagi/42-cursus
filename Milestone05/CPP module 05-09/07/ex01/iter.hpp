
#ifndef ITER_HPP
#define ITER_HPP

#include <iostream>
#include <cstddef>

template <typename T, typename Func>
void iter(T* array_address, const std::size_t length, Func func) {
    for (std::size_t i = 0; i < length; ++i) {
        func(array_address[i]);
    }
}

template <typename T>
void doubleValue(T& element) {
    element *= 2;
}

template <typename T>
void displayElement(const T& element) {
    std::cout << "[" << element << "] ";
}

#endif
