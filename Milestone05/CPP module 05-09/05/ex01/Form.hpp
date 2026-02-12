
#ifndef FORM_HPP
#define FORM_HPP

#include "Bureaucrat.hpp"

#include <iostream>
#include <string>
#include <stdexcept>

class Bureaucrat;

class Form {
public:
	class GradeTooHighException : public std::exception{
	public:
		const char* what() const throw(){
			return "Form exception: Grade is too high (must be <= 1)";
		}
	};
	class GradeTooLowException : public std::exception{
	public:
		const char* what() const throw(){
			return "Form exception: Grade is too low (must be >= 150)";
		}
	};

	Form(const std::string& name, int sign_grade, int exec_grade);
	Form(const Form& other);
	Form& operator=(const Form& other);
	virtual ~Form();

	const std::string& getName() const;
	bool getSignedStatus() const;
	int getGradeToSign() const;
	int getGradeToExecute() const;

	void beSigned(Bureaucrat& b);

private:
	const std::string _name;
	bool _is_signed;
	const int _grade_to_sign;
	const int _grade_to_execute;

	Form();
	void checkGrade(int grade);
};

std::ostream& operator<<(std::ostream& os, const Form& form);

#endif
