
#include "PhoneBook.hpp"
#include <iostream>
#include <sstream>
#include <iomanip>

PhoneBook::PhoneBook(){
	this->numContacts = 0;
	this->oldestIndex = 0;
}

void PhoneBook::addContact()
{
	Contact &currentContact = this->contacts[this->oldestIndex];
	std::string input;

	std::cout << "\n--- ADD NEW CONTACT ---" << std::endl;
	input.clear();
	while(input.empty()){
		std::cout << "Enter First Name: ";
		std::getline(std::cin, input);
		if(input.empty())
			std::cout << "Error: Field cannnot be empty." << std::endl;
	}
	currentContact.setFirstName(input);
	input.clear();
	while(input.empty()){
		std::cout << "Enter Last Name: ";
		std::getline(std::cin, input);
		if(input.empty())
			std::cout << "Error: Field cannnot be empty." << std::endl;
	}
	currentContact.setLastName(input);
	input.clear();
	while(input.empty()){
		std::cout << "Enter Nickname: ";
		std::getline(std::cin, input);
		if(input.empty())
			std::cout << "Error: Field cannnot be empty." << std::endl;
	}
	currentContact.setNickname(input);
	input.clear();
	while(input.empty()){
		std::cout << "Enter Phone Number: ";
		std::getline(std::cin, input);
		if(input.empty())
			std::cout << "Error: Field cannnot be empty." << std::endl;
	}
	currentContact.setPhoneNumber(input);
	input.clear();
	while(input.empty()){
		std::cout << "Enter Darkest Secret: ";
		std::getline(std::cin, input);
		if(input.empty())
			std::cout << "Error: Field cannnot be empty." << std::endl;
	}
	currentContact.setDarkestSecret(input);
	this->oldestIndex = (this->oldestIndex + 1) % 8;
	if(this->numContacts < 8)
		this->numContacts++;
	std::cout << "Contact added successfully to index " << (this->oldestIndex - 1 + 8) % 8 << ".\n" << std::endl;
}

static void display_column(std::string text){
	if(text.length() > 10)
		text = text.substr(0, 9) + ".";
	std::cout << "|" << std::setw(10) << std::right << text;
}

static int my_stoi(const std::string& str) {
    std::stringstream ss(str);
    int result;
    if (!(ss >> result))
        return (-1);
    return (result);
}

void PhoneBook::searchContact()
{
	std::string input;
	int			index;

	if(this->numContacts == 0){
		std::cout << "The phonebook is currently empty.\n" << std::endl;
		return;
	}
	std::cout << "\n---------------------------------------------" << std::endl;
	display_column("Index");
    display_column("First Name");
    display_column("Last Name");
    display_column("Nickname");
	std::cout << "|" << std::endl;
    std::cout << "---------------------------------------------" << std::endl;
	for(int i = 0; i < this->numContacts; i++){
		std::stringstream ss;
		ss << i;
		display_column(ss.str());
		display_column(this->contacts[i].getFirstName());
        display_column(this->contacts[i].getLastName());
        display_column(this->contacts[i].getNickname());
        std::cout << "|" << std::endl;
	}
	std::cout << "---------------------------------------------" << std::endl;
	std::cout << "Enter index for details: ";
    std::getline(std::cin, input);
    index = my_stoi(input);
    if (index >= 0 && index < this->numContacts) {
        std::cout << "\n--- Contact Details (Index " << index << ") ---" << std::endl;
        this->contacts[index].displayAllInfo();
        std::cout << "---------------------------------------------\n" << std::endl;
    } else {
        std::cout << "Invalid index or input.\n" << std::endl;
    }
}
