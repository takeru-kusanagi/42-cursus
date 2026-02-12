
#include "Intern.hpp"
#include "ShrubberyCreationForm.hpp"
#include "RobotomyRequestForm.hpp"
#include "PresidentialPardonForm.hpp"
#include <iostream>

Intern::Intern() {}
Intern::Intern(const Intern& other) { *this = other; }
Intern& Intern::operator=(const Intern& other) {
	(void)other;
	return *this;
}
Intern::~Intern() {}

AForm* Intern::createShrubbery(const std::string& target) { return new ShrubberyCreationForm(target); }
AForm* Intern::createRobotomy(const std::string& target) { return new RobotomyRequestForm(target); }
AForm* Intern::createPardon(const std::string& target) { return new PresidentialPardonForm(target); }

AForm* Intern::makeForm(const std::string& name, const std::string& target) {
    std::string names[] = {
        "shrubbery creation",
        "robotomy request",
        "presidential pardon"
    };
    AForm* (Intern::*creators[])(const std::string&) = {
        &Intern::createShrubbery,
        &Intern::createRobotomy,
        &Intern::createPardon
    };
    for (int i = 0; i < 3; i++) {
        if (name == names[i]) {
            std::cout << "Intern creates " << name << std::endl;
            return (this->*creators[i])(target);
        }
    }
    std::cout << "Error: Intern cannot create form '" << name << "' (name not found)." << std::endl;
    return NULL;
}
