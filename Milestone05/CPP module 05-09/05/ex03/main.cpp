
#include "Bureaucrat.hpp"
#include "AForm.hpp"
#include "ShrubberyCreationForm.hpp"
#include "RobotomyRequestForm.hpp"
#include "PresidentialPardonForm.hpp"
#include "Intern.hpp"

#include <iostream>
#include <ctime>
#include <cstdlib>

int main() {
    srand(time(NULL));

    Bureaucrat president("Zaphod", 1);
    Bureaucrat high_mgr("Manager", 40);
    Intern someRandomIntern;

    std::cout << "--- OFFICE OPENING ---" << std::endl;
    std::cout << president << std::endl;
    std::cout << high_mgr << std::endl;

    {
        std::cout << "\n--- SCENARIO 1: INTERN CREATES VALID FORMS ---" << std::endl;
        AForm* rrf;
        AForm* scf;
        AForm* ppf;

        rrf = someRandomIntern.makeForm("robotomy request", "Bender");
        scf = someRandomIntern.makeForm("shrubbery creation", "Garden");
        ppf = someRandomIntern.makeForm("presidential pardon", "Ford Prefect");

        if (rrf) {
            high_mgr.signForm(*rrf);
            high_mgr.executeForm(*rrf);
            delete rrf;
        }
        if (scf) {
            high_mgr.signForm(*scf);
            high_mgr.executeForm(*scf);
            delete scf;
        }
        if (ppf) {
            president.signForm(*ppf);
            president.executeForm(*ppf);
            delete ppf;
        }
    }

    {
        std::cout << "\n--- SCENARIO 2: INTERN FAILS (UNKNOWN FORM) ---" << std::endl;
        AForm* unknown;

        unknown = someRandomIntern.makeForm("coffee request", "Boss");

        if (!unknown) {
            std::cout << "As expected, the intern couldn't create the unknown form." << std::endl;
        } else {
            delete unknown;
        }
    }

    {
        std::cout << "\n--- SCENARIO 3: COMPLETE WORKFLOW (SHRUBBERY) ---" << std::endl;
        AForm* form;

        form = someRandomIntern.makeForm("shrubbery creation", "Home");
        if (form) {
            std::cout << *form << std::endl;
            president.signForm(*form);
            president.executeForm(*form);
            delete form;
        }
    }

    std::cout << "\n--- ALL TESTS COMPLETED ---" << std::endl;
    return 0;
}
