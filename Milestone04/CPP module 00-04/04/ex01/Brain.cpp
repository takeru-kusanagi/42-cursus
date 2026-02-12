
#include "Brain.hpp"

#include <sstream>
#include <string>
#include <iostream>

Brain::Brain(){
	for(int i = 0; i < 100; ++i){
		std::stringstream ss;
		ss << i;
		this->ideas[i] = "Initial Brain Idea" + ss.str();
	}
	std::cout << "Brain default constructor called. Ideas initialized." << std::endl;
}

Brain::Brain(const Brain& other){
	for(int i = 0; i < 100; ++i){
		this->ideas[i] = other.ideas[i];
	}
	std::cout << "Brain copy constructor called. Deep copy successful." << std::endl;
}

Brain& Brain::operator=(const Brain& other){
	std::cout << "Brain assignment operator called. Performing deep copy." << std::endl;
	if(this != &other){
		for (int i = 0; i < 100; ++i) {
            this->ideas[i] = other.ideas[i];
        }
	}
	return *this;
}

Brain::~Brain(){
	std::cout << "Brain destructor called. Ideas are gone." << std::endl;
}

void Brain::setIdea(int index, const std::string& idea) {
    if (index >= 0 && index < 100) {
        this->ideas[index] = idea;
    }
}

const std::string& Brain::getIdea(int index) const {
    if (index >= 0 && index < 100) {
        return this->ideas[index];
    }
    return this->ideas[0];
}
