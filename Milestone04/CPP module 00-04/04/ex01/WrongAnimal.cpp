
#include "WrongAnimal.hpp"

#include <string>
#include <iostream>

WrongAnimal::WrongAnimal() : type("WrongAnimal"){
    std::cout << "WrongAnimal default constructor called" << std::endl;
}

WrongAnimal::WrongAnimal(const WrongAnimal& other) : type(other.type){
	std::cout << "WrongAnimal copy constructor called" << std::endl;
}

WrongAnimal& WrongAnimal::operator=(const WrongAnimal& other){
	std::cout << "WrongAnimal assignment operator called" << std::endl;
	if(this != &other){
		this->type=other.type;
	}
	return *this;
}

WrongAnimal::~WrongAnimal(){
	std::cout << "WrongAnimal destructor called" << std::endl;
}

std::string WrongAnimal::getType() const {
    return this->type;
}

void WrongAnimal::makeSound() const {
    std::cout << "Wrong generic Animal Sound!" << std::endl;
}
