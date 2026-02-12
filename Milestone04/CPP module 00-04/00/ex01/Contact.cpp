
#include "Contact.hpp"
#include <iostream>

Contact::Contact(){
}

void Contact::setFirstName(const std::string& str){
	if(!str.empty()){
		this->firstName = str;
	}
}
void Contact::setLastName(const std::string& str){
    if (!str.empty()) {
        this->lastName = str;
    }
}

void Contact::setNickname(const std::string& str){
    if (!str.empty()) {
        this->nickname = str;
    }
}

void Contact::setPhoneNumber(const std::string& str){
    if (!str.empty()) {
        this->phoneNumber = str;
    }
}

void Contact::setDarkestSecret(const std::string& str){
    if (!str.empty()) {
        this->darkestSecret = str;
    }
}

std::string Contact::getFirstName() const{
	return this->firstName;
}

std::string Contact::getLastName() const{
    return this->lastName;
}

std::string Contact::getNickname() const{
    return this->nickname;
}

std::string Contact::getPhoneNumber() const{
    return this->phoneNumber;
}

std::string Contact::getDarkestSecret() const{
    return this->darkestSecret;
}

void Contact::displayAllInfo() const{
	std::cout << "First Name:     " << this->firstName << std::endl;
	std::cout << "Last Name:      " << this->lastName << std::endl;
	std::cout << "Nickname:       " << this->nickname << std::endl;
	std::cout << "Phone Number:   " << this->phoneNumber << std::endl;
	std::cout << "Darkest Secret: " << this->darkestSecret << std::endl;
}
