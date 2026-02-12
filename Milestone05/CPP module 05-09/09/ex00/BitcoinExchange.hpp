
#ifndef BITCOINEXCHANGE_HPP
#define BITCOINEXCHANGE_HPP

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <map>
#include <algorithm>
#include <stdexcept>
#include <limits>

class BitcoinExchange
{
public:
    BitcoinExchange();
    BitcoinExchange(const BitcoinExchange &other);
    BitcoinExchange &operator=(const BitcoinExchange &other);
    ~BitcoinExchange();

    void loadDatabase(const std::string &filename);
    void processInputFile(const std::string &filename);

private:
    std::map<std::string, float> _data;

    bool isValidDate(const std::string &date) const;
    float isValidValue(const std::string &valueStr) const;
    bool parseLine(const std::string &line, std::string &date, float &value) const;
};

#endif
