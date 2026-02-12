
# ifndef BUREAUCRAT_HPP
# define BUREAUCRAT_HPP

#include <string>
#include <stdexcept>

class AForm;

class Bureaucrat{
public:
	class GradeTooHighException : public std::exception{
    public:
        const char* what() const throw() {
            return "GradeTooHighException: Grade must be 1 or higher.";
        }
    };

    class GradeTooLowException : public std::exception {
    public:
        const char* what() const throw(){
            return "GradeTooLowException: Grade must be 150 or lower.";
        }
    };

	Bureaucrat(const std::string& name, int grade);
	Bureaucrat(const Bureaucrat& other);
	Bureaucrat& operator=(const Bureaucrat& other);
	virtual ~Bureaucrat();

	const std::string& getName() const;
	int getGrade() const;

	void incrementGrade();
	void decrementGrade();

	void signForm(AForm& f);
	void executeForm(AForm const & form) const;
private:
	const std::string _name;
	int _grade;

	Bureaucrat();
};

std::ostream& operator<<(std::ostream& os, const Bureaucrat& bureaucrat);

# endif
