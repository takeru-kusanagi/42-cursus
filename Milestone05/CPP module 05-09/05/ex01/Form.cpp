
#include "Form.hpp"
#include "Bureaucrat.hpp"

#include <string>
#include <iostream>

//Form::Form(){}

void Form::checkGrade(int grade) {
    if (grade < 1) {
        throw Form::GradeTooHighException();
    }
    if (grade > 150) {
        throw Form::GradeTooLowException();
    }
}

Form::Form(const std::string& name, int sign_grade, int exec_grade)
	: _name(name), _is_signed(false),
	  _grade_to_sign(sign_grade), _grade_to_execute(exec_grade) {
	checkGrade(_grade_to_sign);
	checkGrade(_grade_to_execute);
}

Form::Form(const Form& other) :
	_name(other._name),
	_is_signed(other._is_signed),
	_grade_to_sign(other._grade_to_sign),
	_grade_to_execute(other._grade_to_execute){
}

Form& Form::operator=(const Form& other){
	if(this != &other){
		_is_signed = other._is_signed;
	}
	return *this;
}

Form::~Form(){
}

const std::string& Form::getName() const {
    return _name;
}

bool Form::getSignedStatus() const {
    return _is_signed;
}

int Form::getGradeToSign() const {
    return _grade_to_sign;
}

int Form::getGradeToExecute() const {
    return _grade_to_execute;
}

void Form::beSigned(Bureaucrat& b){
	if (_is_signed) {
        return;
    }
	if(b.getGrade() <= _grade_to_sign) {
		_is_signed = true;
	}else{
		throw Form::GradeTooLowException();
	}
}

std::ostream& operator<<(std::ostream& os, const Form& form) {
    os << "Form: " << form.getName()
       << " (Signed: " << (form.getSignedStatus() ? "Yes" : "No")
       << ", Sign Grade: " << form.getGradeToSign()
       << ", Execute Grade: " << form.getGradeToExecute()
       << ")";
    return os;
}
