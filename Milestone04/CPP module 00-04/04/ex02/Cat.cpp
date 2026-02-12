
#include "Cat.hpp"

#include <string>
#include <iostream>

Cat::Cat() : Animal(){
	this->type = "Cat";
	this->brain = new Brain();
	std::cout << "Cat default constructor called" << std::endl;
}

Cat::Cat(const Cat& other) : Animal(other){
    if (other.brain != NULL) {
        this->brain = new Brain(*(other.brain));
    } else {
        this->brain = NULL;
    }
    std::cout << "Cat copy constructor called" << std::endl;
}

Cat& Cat::operator=(const Cat& other){
    std::cout << "Cat assignment operator called" << std::endl;
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

Cat::~Cat(){
	delete this->brain;
	std::cout << "Cat destructor called" << std::endl;
}

void Cat::makeSound() const{
	std::cout << "Meow! Meow!" << std::endl;
}

void Cat::setIdea(int index, const std::string& idea) {
    if (this->brain) {
        this->brain->setIdea(index, idea);
    }
}

const std::string& Cat::getIdea(int index) const {
    if (this->brain) {
        return this->brain->getIdea(index);
    }
    static const std::string error = "No Brain";
    return error;
}
