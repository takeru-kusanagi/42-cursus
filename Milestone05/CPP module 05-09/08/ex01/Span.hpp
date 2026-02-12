
#ifndef SPAN_HPP
#define SPAN_HPP

#include <vector>
#include <algorithm>
#include <numeric>
#include <stdexcept>
#include <limits>
#include <iostream>
#include <cmath>

class Span
{
private:
    std::vector<int> _numbers;
    unsigned int _maxSize;
    Span();

public:
    Span(unsigned int N);
    Span(const Span &other);
    Span &operator=(const Span &other);
    ~Span();

    void addNumber(int number);
    long longestSpan() const;
    long shortestSpan() const;

    template <typename Iterator>
    void addRange(Iterator begin, Iterator end)
    {
        long distance = std::distance(begin, end);
        if (static_cast<long>(_numbers.size()) + distance > _maxSize)
        {
            throw MaxCapacityReachedException();
        }
        _numbers.insert(_numbers.end(), begin, end);
    }

    class MaxCapacityReachedException : public std::exception
    {
    public:
        MaxCapacityReachedException() {}
        MaxCapacityReachedException(const MaxCapacityReachedException &other) { *this = other; }
        MaxCapacityReachedException &operator=(const MaxCapacityReachedException &other)
        {
            (void)other;
            return *this;
        }
        virtual ~MaxCapacityReachedException() throw() {}
        virtual const char *what() const throw() { return "Span: Capacity reached"; }
    };

    class NoSpanCanBeFoundException : public std::exception
    {
    public:
        NoSpanCanBeFoundException() {}
        NoSpanCanBeFoundException(const NoSpanCanBeFoundException &other)
        {
            (void)other;
        }
        NoSpanCanBeFoundException &operator=(const NoSpanCanBeFoundException &other)
        {
            (void)other;
            return *this;
        }
        virtual ~NoSpanCanBeFoundException() throw() {}
        virtual const char *what() const throw()
        {
            return "Span: No span can be found (0 or 1 element stored).";
        }
    };
};

#endif
