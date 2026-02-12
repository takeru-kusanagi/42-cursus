#include "Bureaucrat.hpp"

#include "Form.hpp"
#include <iostream>

void test_form_creation(const std::string& name, int sign_g, int exec_g) {
    std::cout << "\n--- Testing Form Creation: " << name << " ---" << std::endl;
    try {
        Form f(name, sign_g, exec_g);
        std::cout << "SUCCESS: " << f << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "FAILURE: Caught exception: " << e.what() << std::endl;
    }
}

void test_signing_scenario(Bureaucrat& b, Form& f) {
    std::cout << "\n--- Testing Signing: " << b.getName() << " attempts " << f.getName() << " ---" << std::endl;
    std::cout << "Before: " << f << std::endl;

    b.signForm(f);

    if (f.getSignedStatus()) {
        std::cout << "SUCCESS: Form is now signed." << std::endl;
    } else {
        std::cout << "Result: Form remains unsigned." << std::endl;
    }
}

int main() {
    test_form_creation("Standard Contract", 50, 100);
    test_form_creation("Presidential Decree", 1, 1);
    test_form_creation("Intern Leave Form", 150, 150);

    test_form_creation("Invalid High Sign", 0, 10);
    test_form_creation("Invalid Low Exec", 10, 151);

    Bureaucrat CEO("The CEO", 1);
    Bureaucrat Manager("Senior Manager", 49);
    Bureaucrat Intern("The New Guy", 150);

    Form high_level("High Level Budget (G:50)", 50, 20);
    Form max_level("Top Secret Approval (G:1)", 1, 1);

    test_signing_scenario(Manager, high_level);
    test_signing_scenario(Intern, high_level);
    test_signing_scenario(CEO, max_level);
    test_signing_scenario(Manager, max_level);

    return 0;
}
