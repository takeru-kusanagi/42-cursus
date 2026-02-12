
#include "Bureaucrat.hpp"

#include <string>
#include <iostream>

void test_creation(const std::string& name, int grade){
	std::cout << "\n--- Testing Creation: " << name << " (" << grade << ") ---" << std::endl;
    try {
        Bureaucrat b(name, grade);
        std::cout << "SUCCESS: " << b << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "FAILURE: Caught exception: " << e.what() << std::endl;
    }
}

void test_increment(Bureaucrat& b) {
    std::cout << "\n--- Testing Increment for " << b.getName() << " (Grade: " << b.getGrade() << ") ---" << std::endl;
    try {
        b.incrementGrade();
        std::cout << "SUCCESS: New status: " << b << std::endl;
    } catch (const Bureaucrat::GradeTooHighException& e) {
        std::cerr << "FAILURE: Caught expected exception: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "FAILURE: Caught unexpected exception: " << e.what() << std::endl;
    }
}

void test_decrement(Bureaucrat& b) {
    std::cout << "\n--- Testing Decrement for " << b.getName() << " (Grade: " << b.getGrade() << ") ---" << std::endl;
    try {
        b.decrementGrade();
        std::cout << "SUCCESS: New status: " << b << std::endl;
    } catch (const Bureaucrat::GradeTooLowException& e) {
        std::cerr << "FAILURE: Caught expected exception: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "FAILURE: Caught unexpected exception: " << e.what() << std::endl;
    }
}

int main(){
    test_creation("John Doe", 75);
    test_creation("Max Level", 1);
    test_creation("Min Level", 150);

    test_creation("Too High Test", 0);
    test_creation("Too Low Test", 151);

    Bureaucrat mid("Jane Doe", 75);
    Bureaucrat max("The Vice President", 2);
    Bureaucrat min("The Intern", 149);

    test_increment(mid);
    test_increment(max);

    std::cout << "\n--- Testing Grade 1 Increment (EXPECT EXCEPTION) ---" << std::endl;
    test_increment(max);

    test_decrement(mid);
    test_decrement(min);

    std::cout << "\n--- Testing Grade 150 Decrement (EXPECT EXCEPTION) ---" << std::endl;
    test_decrement(min);

    return 0;
}
