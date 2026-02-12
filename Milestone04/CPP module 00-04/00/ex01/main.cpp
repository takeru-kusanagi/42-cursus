
#include "PhoneBook.hpp"
#include <iostream>
#include <string>

int main()
{
	PhoneBook phoneBook;
	std::string command;

	while(true)
	{
		std::cout << "Enter (ADD, SEARCH, EXIT): ";
		if(!(std::getline(std::cin, command)))
			break;
		if(command == "EXIT")
			break;
		else if(command == "ADD")
			phoneBook.addContact();
		else if(command == "SEARCH")
			phoneBook.searchContact();
	}
	std::cout << "Goodbye! Contacts lost forever." << std::endl;
	return(0);
}
