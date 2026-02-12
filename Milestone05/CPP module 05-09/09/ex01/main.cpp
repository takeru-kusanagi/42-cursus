
#include "RPN.hpp"
#include <iostream>

#define ERROR_ARGUMENT 1

int main(int ac, char **av)
{
    if (ac != 2){
        std::cerr << "Usage: ./RPN \"<RPN expression>\"" << std::endl;
        return ERROR_ARGUMENT;
    }
    try{
        RPN calculator;
        calculator.calculate(av[1]);
    }
    catch (const std::exception &e){
        std::cerr << e.what() << std::endl;
        return EXIT_FAILURE;
    }
    catch (...){
        std::cerr << "An unknown error occurred." << std::endl;
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
