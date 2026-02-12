
#include "Dog.hpp"

#include <string>
#include <iostream>

Dog::Dog() : Animal(){
	this->type = "Dog";
	this->brain = new Brain();
	std::cout << "Dog default constructor called" << std::endl;
}

Dog::Dog(const Dog& other) : Animal(other){
    if (other.brain != NULL) {
        this->brain = new Brain(*(other.brain));
    } else {
        this->brain = NULL;
    }
    std::cout << "Dog copy constructor called" << std::endl;
}

Dog& Dog::operator=(const Dog& other){
    std::cout << "Dog assignment operator called" << std::endl;
    if (this != &other) {
        Animal::operator=(other);
        Brain* new_brain = NULL;
        if (other.brain != NULL) {
            new_brain = new Brain(*(other.brain));
        }
        delete this->brain;
        this->brain = new_brain;
    }
    return *this;
}

Dog::~Dog(){
	delete this->brain;
	std::cout << "Dog destructor called" << std::endl;
}

void Dog::makeSound() const{
	std::cout << "Woof! Woof!" << std::endl;
}

void Dog::setIdea(int index, const std::string& idea) {
    if (this->brain) {
        this->brain->setIdea(index, idea);
    }
}

const std::string& Dog::getIdea(int index) const {
    if (this->brain) {
        return this->brain->getIdea(index);
    }
	static const std::string error = "No Brain";
    return error;
}
