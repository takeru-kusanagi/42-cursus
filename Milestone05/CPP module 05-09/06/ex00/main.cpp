
#include "ScalarConverter.hpp"

void runTest(const std::string& input) {
    std::cout << "\n==========================================" << std::endl;
    std::cout << "Input Literal: \"" << input << "\"" << std::endl;
    std::cout << "==========================================" << std::endl;

    ScalarConverter::convert(input);
}

int main() {
    std::cout << "--- ScalarConverter Test Suite ---" << std::endl;

    runTest("'a'");
    runTest("'0'");

    runTest("0");
    runTest("-42");
    runTest("42");

    runTest("0.0f");
    runTest("4.2f");
    runTest("-4.2f");

    runTest("0.0");
    runTest("4.2");
    runTest("-4.2");

    runTest("127");
    runTest("128");
    runTest("32000");
    runTest("2147483647");
    runTest("2147483648");


    runTest("nan");
    runTest("nanf");

    runTest("+inf");
    runTest("-inf");
    runTest("+inff");
    runTest("-inff");

    runTest("7");
    runTest("32");
    runTest("127");


    runTest("hello");
    runTest("4.2fa");
    runTest("42.0a");
    runTest("''");
    runTest("'a");

    runTest("97.0976");

    std::cout << std::endl;
    std::cout << "--- End of Test Cases ---" << std::endl;
    std::cout << std::endl;
    return 0;
}
