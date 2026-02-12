
#ifndef SCALARCONVERTER_HPP
#define SCALARCONVERTER_HPP

#include <iostream>
#include <string>
#include <limits>
#include <cmath>
#include <iomanip>
#include <exception>
#include <cctype>
#include <sstream>
#include <cstdio>

class ScalarConverter{
public:
	static void convert(const std::string& literal);

private:
	ScalarConverter();
	ScalarConverter(const ScalarConverter& other);
	ScalarConverter& operator=(const ScalarConverter& other);
	virtual ~ScalarConverter();

	static void printChar(double d);
	static void printInt(double d);
    static void printFloat(double d);
    static void printDouble(double d);
};

#endif
