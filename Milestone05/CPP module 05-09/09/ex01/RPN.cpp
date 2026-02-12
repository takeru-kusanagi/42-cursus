
#include "RPN.hpp"

RPN::RPN() {}
RPN::RPN(const RPN &other) : _stack(other._stack) {}
RPN &RPN::operator=(const RPN &other)
{
    if (this != &other)
        _stack = other._stack;
    return *this;
}
RPN::~RPN() {}

bool RPN::isOperator(const std::string &token) const
{
    return (token.length() == 1) && (std::string("+-/*").find(token[0]) != std::string::npos);
}

int RPN::parseAndValidateNumber(const std::string &token)
{
    if (token.length() == 1 && std::isdigit(token[0]))
    {
        int num = token[0] - '0';
        return num;
    }
    throw std::invalid_argument("Error: Invalid number or operand out of range (>= 10).");
}

void RPN::executeOperation(const std::string &op)
{
    if (_stack.size() < 2)
        throw std::runtime_error("Error: Not enough operands for calculation.");
    int operand2 = _stack.top();
    _stack.pop();

    int operand1 = _stack.top();
    _stack.pop();

    int result;

    if (op == "+")
        result = operand1 + operand2;
    else if (op == "-")
        result = operand1 - operand2;
    else if (op == "*")
        result = operand1 * operand2;
    else if (op == "/")
    {
        if (operand2 == 0)
            throw std::runtime_error("Error: Division by zero is forbidden.");
        result = operand1 / operand2;
    }
    else
        throw std::invalid_argument("Error: Unknown operator.");
    _stack.push(result);
}

void RPN::calculate(const std::string &expression)
{
    std::stringstream ss(expression);
    std::string token;

    while (ss >> token)
    {
        if (isOperator(token))
            executeOperation(token);
        else
            _stack.push(parseAndValidateNumber(token));
    }
    if (_stack.size() != 1)
        throw std::runtime_error("Error: Invalid expression format or too many operands remaining.");
    std::cout << _stack.top() << std::endl;
}
