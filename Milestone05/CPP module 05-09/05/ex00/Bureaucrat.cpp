
#include "Bureaucrat.hpp"

#include <string>
#include <iostream>

//Bureaucrat::Bureaucrat(){}

Bureaucrat::Bureaucrat(const std::string& name, int grade) :
	_name(name),
	_grade(grade){
	if(grade < 1){
		throw Bureaucrat::GradeTooHighException();
	}
	if(grade > 150){
		throw Bureaucrat::GradeTooLowException();
	}
}

Bureaucrat::Bureaucrat(const Bureaucrat& other) :
	_name(other._name),
	_grade(other._grade){
}

Bureaucrat& Bureaucrat::operator=(const Bureaucrat& other){
	if(this != &other){
		_grade = other._grade;
	}
	return *this;
}

Bureaucrat::~Bureaucrat(){
}

const std::string& Bureaucrat::getName() const{
	return _name;
}

int Bureaucrat::getGrade() const{
	return _grade;
}

void Bureaucrat::incrementGrade(){
	if(_grade - 1 < 1){
		throw Bureaucrat::GradeTooHighException();
	}
	_grade--;
}

void Bureaucrat::decrementGrade(){
	if(_grade + 1 > 150){
		throw Bureaucrat::GradeTooLowException();
	}
	_grade++;
}

std::ostream& operator<<(std::ostream& os, const Bureaucrat& bureaucrat){
	os << bureaucrat.getName() << ", bureaucrat grade " << bureaucrat.getGrade() << ".";
    return os;
}
