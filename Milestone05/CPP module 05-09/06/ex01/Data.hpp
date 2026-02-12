#ifndef DATA_HPP
# define DATA_HPP

# include <iostream>
# include <string>

struct Data {
    int         value;
    std::string identifier;

    Data();
    Data(int v, const std::string& id);
    Data(const Data& other);
    Data& operator=(const Data& other);
    ~Data();
};

#endif
