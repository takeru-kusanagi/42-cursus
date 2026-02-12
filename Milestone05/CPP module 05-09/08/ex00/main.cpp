

#include "easyfind.hpp"

#include <vector>
#include <list>
#include <deque>

void test_easyfind(const std::string &container_name, int value_to_find)
{
    std::cout << "--- Testing " << container_name << " for value " << value_to_find << " ---" << std::endl;
    try
    {
        std::vector<int> vec;
        vec.push_back(10);
        vec.push_back(20);
        vec.push_back(30);
        vec.push_back(40);
        vec.push_back(30);

        std::cout << "Container elements: [ ";
        for (int i = 0; i < 5; ++i)
        {
            std::cout << vec[i] << " ";
        }
        std::cout << "]" << std::endl;
        std::vector<int>::iterator it = easyfind(vec, value_to_find);
        std::cout << "SUCCESS: Value " << value_to_find << " found at position (value): " << *it << std::endl;
    }
    catch (const NotFoundException &e)
    {
        std::cout << "FAILURE (Expected): " << e.what() << std::endl;
    }
    catch (const std::exception &e)
    {
        std::cerr << "An unexpected error occurred: " << e.what() << std::endl;
    }
    std::cout << std::endl;
}

void test_list()
{
    std::cout << "--- Testing std::list ---" << std::endl;
    std::list<int> lst;
    lst.push_back(5);
    lst.push_back(15);
    lst.push_back(25);
    std::cout << "List elements: [5, 15, 25]" << std::endl;

    try
    {
        std::list<int>::iterator it = easyfind(lst, 15);
        std::cout << "SUCCESS: Value 15 found at position (value): " << *it << std::endl;
    }
    catch (const NotFoundException &e)
    {
        std::cout << "FAILURE: " << e.what() << std::endl;
    }
    try
    {
        easyfind(lst, 99);
        std::cout << "FAILURE (Unexpected): Value 99 was found." << std::endl;
    }
    catch (const NotFoundException &e)
    {
        std::cout << "FAILURE (Expected): Value 99 not found. Exception: " << e.what() << std::endl;
    }
    std::cout << std::endl;
}

int main()
{
    test_easyfind("std::vector", 30);
    test_easyfind("std::vector", 10);
    test_easyfind("std::vector", 30);
    test_easyfind("std::vector", 50);
    test_list();

    return 0;
}
