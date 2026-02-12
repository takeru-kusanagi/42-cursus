
#include "Bureaucrat.hpp"
#include "Form.hpp"

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

void Bureaucrat::signForm(Form& f){
	try{
		f.beSigned(*this);
		std::cout << _name << " signed " << f.getName() << std::endl;
	}catch (const Form::GradeTooLowException& e){
		std::cout << _name << " couldn't sign " << f.getName()
                  << " because " << e.what() << std::endl;
	}
}

std::ostream& operator<<(std::ostream& os, const Bureaucrat& bureaucrat){
	os << bureaucrat.getName() << ", bureaucrat grade " << bureaucrat.getGrade() << ".";
    return os;
}
