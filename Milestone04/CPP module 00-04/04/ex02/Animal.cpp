
#include "Animal.hpp"

#include <string>
#include <iostream>

Animal::Animal() : type("Generic Animal") {
    std::cout << "Animal default constructor called" << std::endl;
}

Animal::Animal(const Animal& other) : type(other.type){
	std::cout << "Animal copy constructor called" << std::endl;
}

Animal& Animal::operator=(const Animal& other){
	std::cout << "Animal assignment operator called" << std::endl;
	if(this != &other){
		this->type = other.type;
	}
	return *this;
}

Animal::~Animal() {
    std::cout << "Animal destructor called" << std::endl;
}

std::string Animal::getType() const{
	return this->type;
}

// void Animal::makeSound() const{
// 	std::cout << "Zzzz... (A non-descript animal sound)" << std::endl;
// }
