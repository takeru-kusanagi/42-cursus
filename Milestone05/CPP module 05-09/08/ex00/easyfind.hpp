

#ifndef EASYFIND_HPP
#define EASYFIND_HPP

#include <algorithm>
#include <stdexcept>
#include <iostream>

class NotFoundException : public std::exception
{
public:
    NotFoundException() {}
    NotFoundException(const NotFoundException &other) { (void)other; }
    NotFoundException &operator=(const NotFoundException &other)
    {
        (void)other;
        return *this;
    }
    virtual ~NotFoundException() throw() {}

    virtual const char *what() const throw()
    {
        return "Error: Value not found in the container.";
    }
};

template <typename T>
typename T::iterator easyfind(T &container, int N)
{
    typename T::iterator it = std::find(container.begin(), container.end(), N);
    if (it == container.end())
    {
        throw NotFoundException();
    }
    return it;
}

#endif
