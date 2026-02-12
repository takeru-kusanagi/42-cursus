
#include "RobotomyRequestForm.hpp"

#include <cstdlib>
#include <ctime>

RobotomyRequestForm::RobotomyRequestForm(const std::string& target)
    : AForm("Robotomy Request Form", 72, 45), _target(target) {
    srand(time(NULL));
}

RobotomyRequestForm::RobotomyRequestForm(const RobotomyRequestForm& other)
    : AForm(other), _target(other._target) {}

	RobotomyRequestForm& RobotomyRequestForm::operator=(const RobotomyRequestForm& other) {
    AForm::operator=(other);
    return *this;
}

RobotomyRequestForm::~RobotomyRequestForm() {}

void RobotomyRequestForm::executeAction() const {
    std::cout << "* Vrrrrrrrrrrrrrrrrrr... Dzzz! *" << std::endl;

    if (rand() % 2 == 0) {
        std::cout << _target << " has been robotomized successfully." << std::endl;
    } else {
        std::cout << "The robotomy on " << _target << " failed." << std::endl;
    }
}
