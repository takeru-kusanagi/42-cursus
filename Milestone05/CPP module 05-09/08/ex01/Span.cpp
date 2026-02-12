

#include "Span.hpp"

Span::Span(unsigned int N) : _maxSize(N) {}
Span::Span(const Span &other) : _numbers(other._numbers), _maxSize(other._maxSize) {}
Span &Span::operator=(const Span &other)
{
    if (this != &other)
    {
        _numbers = other._numbers;
        _maxSize = other._maxSize;
    }
    return *this;
}
Span::~Span() {}

void Span::addNumber(int number)
{
    if (_numbers.size() >= _maxSize)
    {
        throw MaxCapacityReachedException();
    }
    _numbers.push_back(number);
}

long Span::longestSpan() const
{
    if (_numbers.size() <= 1)
    {
        throw NoSpanCanBeFoundException();
    }
    int minVal = *std::min_element(_numbers.begin(), _numbers.end());
    int maxVal = *std::max_element(_numbers.begin(), _numbers.end());

    return static_cast<long>(maxVal) - static_cast<long>(minVal);
}

long Span::shortestSpan() const
{
    if (_numbers.size() <= 1)
    {
        throw NoSpanCanBeFoundException();
    }
    std::vector<int> sortedNumbers = _numbers;
    std::sort(sortedNumbers.begin(), sortedNumbers.end());

    long minSpan = std::numeric_limits<long>::max();

    for (size_t i = 0; i < sortedNumbers.size() - 1; ++i)
    {
        long currentSpan = static_cast<long>(sortedNumbers[i + 1]) - static_cast<long>(sortedNumbers[i]);
        if (currentSpan < minSpan)
        {
            minSpan = currentSpan;
        }
    }
    return minSpan;
}
