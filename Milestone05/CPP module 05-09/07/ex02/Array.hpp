
#ifndef ARRAY_HPP
#define ARRAY_HPP

#include <iostream>
#include <stdexcept>
#include <cstdlib>

template <typename T>
class Array {
private:
    T* _data;
    unsigned int _size;

public:
    Array() : _data(0), _size(0) {
        std::cout << "Array default constructed (empty)." << std::endl;
    }

    Array(unsigned int n) : _data(new T[n]()), _size(n) {
        std::cout << "Array constructed with size " << n << std::endl;
    }

    Array(const Array& other) : _data(0), _size(other._size) {
        std::cout << "Array copy constructed (Deep Copy)." << std::endl;
        if (_size > 0) {
            _data = new T[_size];
            for (unsigned int i = 0; i < _size; ++i) {
                _data[i] = other._data[i];
            }
        }
    }

    ~Array() {
        std::cout << "Array destroyed." << std::endl;
        delete[] _data;
    }

    Array& operator=(const Array& other) {
        std::cout << "Array copy assigned (Deep Copy)." << std::endl;
        if (this != &other) {
            delete[] _data;
            _data = 0;
            _size = 0;
            _size = other._size;
            if (_size > 0) {
                _data = new T[_size];
                for (unsigned int i = 0; i < _size; ++i) {
                    _data[i] = other._data[i];
                }
            }
        }
        return *this;
    }

    unsigned int size() const {
        return _size;
    }

    T& operator[](unsigned int index) {
        if (index >= _size) {
            throw OutOfBoundsException();
        }
        return _data[index];
    }

    const T& operator[](unsigned int index) const {
        if (index >= _size) {
            throw OutOfBoundsException();
        }
        return _data[index];
    }

    class OutOfBoundsException : public std::exception {
    public:
        const char* what() const throw() {
            return "Array: Index is out of bounds";
        }
    };
};

#endif
