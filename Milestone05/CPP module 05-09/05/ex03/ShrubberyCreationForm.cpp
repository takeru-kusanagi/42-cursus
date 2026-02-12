
#include "ShrubberyCreationForm.hpp"

#include <fstream>

ShrubberyCreationForm::ShrubberyCreationForm(const std::string& target)
    : AForm("Shrubbery Creation Form", 145, 137), _target(target) {}

ShrubberyCreationForm::ShrubberyCreationForm(const ShrubberyCreationForm& other)
    : AForm(other), _target(other._target) {}

ShrubberyCreationForm& ShrubberyCreationForm::operator=(const ShrubberyCreationForm& other) {
    AForm::operator=(other);
    return *this;
}

ShrubberyCreationForm::~ShrubberyCreationForm() {}

void ShrubberyCreationForm::executeAction() const {
    std::string filename = _target + "_shrubbery";
    std::ofstream ofs(filename.c_str());

    if (!ofs.is_open()) {
        std::cerr << "Error: Could not open file " << filename << std::endl;
        return;
    }

    ofs << "       /\\       " << std::endl;
    ofs << "      /\\*\\      " << std::endl;
    ofs << "     /\\O\\/\\     " << std::endl;
    ofs << "    /\\/\\/\\/\\    " << std::endl;
    ofs << "   /\\O\\/\\/\\/\\   " << std::endl;
    ofs << "  /\\/\\/\\O/\\/\\  " << std::endl;
    ofs << "       ||       " << std::endl;
    ofs << "       ||       " << std::endl;
    ofs.close();

    std::cout << "ShrubberyCreationForm: Created file '" << filename << "' with ASCII trees." << std::endl;
}
