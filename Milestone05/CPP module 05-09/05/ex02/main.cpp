
#include "Bureaucrat.hpp"
#include "AForm.hpp"
#include "ShrubberyCreationForm.hpp"
#include "RobotomyRequestForm.hpp"
#include "PresidentialPardonForm.hpp"

#include <iostream>
#include <ctime>
#include <string>
#include <cstdlib>

int main() {
    srand(time(NULL));

    Bureaucrat president("Zaphod", 1);
    Bureaucrat high_mgr("Manager", 40);
    Bureaucrat low_mgr("Janitor", 140);
    Bureaucrat intern("Arthur", 150);
    Bureaucrat just_enough("Goldilocks", 72);

    std::cout << president << std::endl;
    std::cout << high_mgr << std::endl;
    std::cout << low_mgr << std::endl;
    std::cout << intern << std::endl;
    std::cout << just_enough << std::endl;

    {
        std::cout << "\n--- SCENARIO 1: NOT SIGNED EXECUTION (SHOULD FAIL) ---\n";
        AForm* pardon = new PresidentialPardonForm("Zaphod's Pet");
        std::cout << *pardon << std::endl;
        president.executeForm(*pardon);
        delete pardon;
    }

    {
        std::cout << "\n--- SCENARIO 2: SHRUBBERY (SUCCESSFUL SIGN/EXECUTION) ---\n";
        AForm* shrubbery_ok = new ShrubberyCreationForm("Garden");
        std::cout << *shrubbery_ok << std::endl;
        low_mgr.signForm(*shrubbery_ok);
        low_mgr.executeForm(*shrubbery_ok);
        delete shrubbery_ok;
    }

    {
        std::cout << "\n--- SCENARIO 3: ROBOTOMY (SUCCESSFUL SIGN/EXECUTION) ---\n";
        AForm* robotomy_ok = new RobotomyRequestForm("Megatron");
        std::cout << *robotomy_ok << std::endl;
        just_enough.signForm(*robotomy_ok);
        high_mgr.executeForm(*robotomy_ok);
        delete robotomy_ok;
    }

    {
        std::cout << "\n--- SCENARIO 4: SIGNING FAIL (INTERN TOO LOW) ---\n";
        AForm* pardon_fail = new PresidentialPardonForm("Unlucky Guy");
        std::cout << *pardon_fail << std::endl;
        intern.signForm(*pardon_fail);
        delete pardon_fail;
    }

    {
        std::cout << "\n--- SCENARIO 5: EXECUTION FAIL (JANITOR TOO LOW) ---\n";
        AForm* robotomy_exec_fail = new RobotomyRequestForm("The Intern");
        president.signForm(*robotomy_exec_fail);
        std::cout << *robotomy_exec_fail << std::endl;
        low_mgr.executeForm(*robotomy_exec_fail);
        delete robotomy_exec_fail;
    }

    {
        std::cout << "\n--- SCENARIO 6: PRESIDENTIAL PARDON (SUCCESS) ---\n";
        AForm* pardon_success = new PresidentialPardonForm("Ford Prefect");
        president.signForm(*pardon_success);
        president.executeForm(*pardon_success);
        delete pardon_success;
    }

    {
        std::cout << "\n--- SCENARIO 7: SHRUBBERY CREATION SUCCESS ---\n";
        AForm* shrubbery_final = new ShrubberyCreationForm("TestPlot");
        std::cout << *shrubbery_final << std::endl;
        high_mgr.signForm(*shrubbery_final);
        high_mgr.executeForm(*shrubbery_final);
        delete shrubbery_final;
    }
    return 0;
}
