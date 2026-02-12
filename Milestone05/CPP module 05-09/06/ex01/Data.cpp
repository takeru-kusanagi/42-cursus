
#include "Data.hpp"

Data::Data() : value(0), identifier("default") {
    std::cout << "Data Default constructor called" << std::endl;
}

Data::Data(int v, const std::string& id) : value(v), identifier(id) {
    std::cout << "Data Parameterized constructor called" << std::endl;
}

Data::Data(const Data& other) : value(other.value), identifier(other.identifier) {
    std::cout << "Data Copy constructor called" << std::endl;
}

Data& Data::operator=(const Data& other) {
    std::cout << "Data Copy assignment operator called" << std::endl;
    if (this != &other) {
        this->value = other.value;
        this->identifier = other.identifier;
    }
    return *this;
}

Data::~Data() {
    std::cout << "Data Destructor called for value: " << this->value << std::endl;
}
