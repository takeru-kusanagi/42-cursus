
#ifndef PHONEBOOK_HPP
# define PHONEBOOK_HPP

# include "Contact.hpp"
# include <iostream>

class PhoneBook {
private:
	Contact contacts[8];
	int numContacts;
	int oldestIndex;
public:
	PhoneBook();
	void addContact();
	void searchContact();
};

#endif