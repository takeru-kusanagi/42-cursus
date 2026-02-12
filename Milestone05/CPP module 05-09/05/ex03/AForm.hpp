
#ifndef AFORM_HPP
#define AFORM_HPP

#include <iostream>
#include <string>
#include <stdexcept>

class Bureaucrat;

class AForm {
public:
	class GradeTooHighException : public std::exception{
	public:
		const char* what() const throw(){
			return "Grade is too high (must be <= 1)";
		}
	};

	class GradeTooLowException : public std::exception{
	public:
		const char* what() const throw(){
			return "Bureaucrat's grade is too low for this action";
		}
	};

	class NotSignedException : public std::exception {
    public:
        const char* what() const throw() {
            return "Form is not signed";
        }
    };

	AForm(const std::string& name, int sign_grade, int exec_grade);
	AForm(const AForm& other);
	AForm& operator=(const AForm& other);
	virtual ~AForm();

	const std::string& getName() const;
	bool getSignedStatus() const;
	int getGradeToSign() const;
	int getGradeToExecute() const;

	void beSigned(const Bureaucrat& b);
	void execute(Bureaucrat const & executor) const;
    virtual void executeAction() const = 0;

private:
	const std::string _name;
	bool _is_signed;
	const int _grade_to_sign;
	const int _grade_to_execute;

	AForm();
	void checkGrade(int grade);
};

std::ostream& operator<<(std::ostream& os, const AForm& aform);

#endif
