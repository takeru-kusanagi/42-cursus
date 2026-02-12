
#include "AForm.hpp"
#include "Bureaucrat.hpp"

#include <string>
#include <iostream>

//AForm::AForm(){}

void AForm::checkGrade(int grade) {
    if (grade < 1) {
        throw AForm::GradeTooHighException();
    }
    if (grade > 150) {
        throw AForm::GradeTooLowException();
    }
}

AForm::AForm(const std::string& name, int sign_grade, int exec_grade)
	: _name(name), _is_signed(false),
	  _grade_to_sign(sign_grade), _grade_to_execute(exec_grade) {
	checkGrade(_grade_to_sign);
	checkGrade(_grade_to_execute);
}

AForm::AForm(const AForm& other) :
	_name(other._name),
	_is_signed(other._is_signed),
	_grade_to_sign(other._grade_to_sign),
	_grade_to_execute(other._grade_to_execute){
}

AForm& AForm::operator=(const AForm& other){
	if(this != &other){
		_is_signed = other._is_signed;
	}
	return *this;
}

AForm::~AForm(){
}

const std::string& AForm::getName() const { return _name; }
bool AForm::getSignedStatus() const { return _is_signed; }
int AForm::getGradeToSign() const { return _grade_to_sign; }
int AForm::getGradeToExecute() const { return _grade_to_execute; }

void AForm::beSigned(const Bureaucrat& b){
	if (_is_signed) { return; }
	if(b.getGrade() <= _grade_to_sign) {
		_is_signed = true;
	}else{
		throw AForm::GradeTooLowException();
	}
}

void AForm::execute(Bureaucrat const & executor) const {
    if (!_is_signed) {
        throw AForm::NotSignedException();
    }
    if (executor.getGrade() > _grade_to_execute) {
        throw AForm::GradeTooLowException();
    }
   executeAction();
}

std::ostream& operator<<(std::ostream& os, const AForm& form) {
    os << "AForm: " << form.getName()
       << " (Signed: " << (form.getSignedStatus() ? "Yes" : "No")
       << ", Sign Grade: " << form.getGradeToSign()
       << ", Execute Grade: " << form.getGradeToExecute()
       << ")";
    return os;
}
