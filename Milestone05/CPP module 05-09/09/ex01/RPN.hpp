
#ifndef RPN_HPP
#define RPN_HPP

#include <stack>
#include <string>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <cstdlib>

class RPN
{
public:
    RPN();
    RPN(const RPN &other);
    RPN &operator=(const RPN &other);
    ~RPN();

    void calculate(const std::string &expression);
    int parseAndValidateNumber(const std::string &token);

private:
    std::stack<int> _stack;

    bool isOperator(const std::string &token) const;
    void executeOperation(const std::string &op);
};

#endif
