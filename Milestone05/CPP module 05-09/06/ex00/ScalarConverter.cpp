
#include "ScalarConverter.hpp"

void ScalarConverter::printChar(double d){
	std::cout << "char: ";
	if (std::isnan(d) || std::isinf(d)) {
        std::cout << "impossible" << std::endl;
        return;
    }
	if(d < std::numeric_limits<char>::min() || d > std::numeric_limits<char>::max()){
		std::cout << "impossible" << std::endl;
		return;
	}
	char c = static_cast<char>(d);
	if(std::isprint(c)){
		std::cout << "'" << c << "'" << std::endl;
	}else{
		std::cout << "Non displayable" << std::endl;
	}
}

void ScalarConverter::printInt(double d){
	std::cout << "int: ";
    if (std::isnan(d) || std::isinf(d)) {
        std::cout << "impossible" << std::endl;
        return;
    }
	if (d < std::numeric_limits<int>::min() || d > std::numeric_limits<int>::max()) {
        std::cout << "impossible" << std::endl;
        return;
    }
    int i = static_cast<int>(d);
    std::cout << i << std::endl;
}

void ScalarConverter::printFloat(double d) {
    std::cout << "float: ";
    std::cout << std::fixed << std::setprecision(1);
    float f = static_cast<float>(d);
    std::cout << f << "f" << std::endl;
}

void ScalarConverter::printDouble(double d) {
    std::cout << "double: ";
    if (std::isnan(d) || std::isinf(d)) {
        std::cout << d << std::endl;
        return;
    }
    std::cout << std::fixed << std::setprecision(1);
    std::cout << d << std::endl;
}

void ScalarConverter::convert(const std::string& literal) {
    double d;

    if (literal == "nan" || literal == "nanf") {
        d = std::numeric_limits<double>::quiet_NaN();
    } else if (literal == "+inf" || literal == "+inff") {
        d = std::numeric_limits<double>::infinity();
    } else if (literal == "-inf" || literal == "-inff") {
        d = -std::numeric_limits<double>::infinity();
    }
    else if (literal.length() == 3 && literal[0] == '\'' && literal[2] == '\'') {
        d = static_cast<double>(literal[1]);
    }
    else {
        std::stringstream ss(literal);
        char remaining_char = 0;
        try {
            if (!(ss >> d)) {
                throw std::invalid_argument("Failed to convert string to double.");
            }
            if (ss >> remaining_char) {
                if (remaining_char == 'f') {
                    if (ss.peek() != EOF) {
                        throw std::invalid_argument("Extra characters after 'f'.");
                    }
                } else {
                    throw std::invalid_argument("Incomplete parsing or invalid characters.");
                }
            } else {
                if (literal.length() > 0 && literal[literal.length() - 1] == 'f') {
                    throw std::invalid_argument("Invalid floating point format ending with 'f'.");
                }
            }
        } catch (const std::exception& e) {
            std::cout << "Error: Invalid literal format." << std::endl;
            return;
        }
    }
    printChar(d);
    printInt(d);
    printFloat(d);
    printDouble(d);
}


ScalarConverter::ScalarConverter() {}
ScalarConverter::ScalarConverter(const ScalarConverter& other) { (void)other; }
ScalarConverter& ScalarConverter::operator=(const ScalarConverter& other) { (void)other; return *this; }
ScalarConverter::~ScalarConverter() {}
