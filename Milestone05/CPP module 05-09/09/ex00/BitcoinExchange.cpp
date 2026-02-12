
#include "BitcoinExchange.hpp"

BitcoinExchange::~BitcoinExchange() {}
BitcoinExchange::BitcoinExchange(const BitcoinExchange &other) : _data(other._data) {}
BitcoinExchange &BitcoinExchange::operator=(const BitcoinExchange &other)
{
    if (this != &other)
        _data = other._data;
    return *this;
}
BitcoinExchange::BitcoinExchange() {}

bool BitcoinExchange::isValidDate(const std::string &date) const
{
    if (date.length() != 10 || date[4] != '-' || date[7] != '-')
        return false;
    int year, month, day;
    char dash1, dash2;
    std::stringstream ss(date);
    if (!(ss >> year >> dash1 >> month >> dash2 >> day) || ss.peek() != EOF)
        return false;
    if (dash1 != '-' || dash2 != '-')
        return false;
    if (year < 2009 || month < 1 || month > 12 || day < 1 || day > 31)
        return false;
    if ((month == 4 || month == 6 || month == 9 || month == 11) && day > 30)
        return false;
    if (month == 2)
    {
        bool isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        if ((isLeap && day > 29) || (!isLeap && day > 28))
            return false;
    }
    return true;
}

float BitcoinExchange::isValidValue(const std::string &valueStr) const
{
    float value;
    std::stringstream ss(valueStr);

    if (!(ss >> value) || ss.peek() != EOF)
        return -1.0f;
    if (value < 0)
        throw std::invalid_argument("not a positive number.");
    if (value > 1000.0f)
        throw std::out_of_range("too large a number.");
    return value;
}

bool BitcoinExchange::parseLine(const std::string &line, std::string &date, float &value) const
{

    size_t pipePos = line.find(" | ");

    if (pipePos == std::string::npos || pipePos + 3 >= line.length()){
        std::cerr << "Error: bad input => " << line << std::endl;
        return false;
    }
    date = line.substr(0, pipePos);
    std::string valueStr = line.substr(pipePos + 3);
    if (!isValidDate(date)){
        std::cerr << "Error: bad input => " << line << std::endl;
        return false;
    }
    try{
        value = isValidValue(valueStr);
        if (value < 0){
            std::cerr << "Error: bad input => " << line << std::endl;
            return false;
        }
    }
    catch (const std::invalid_argument &e){
        std::cerr << "Error: " << e.what() << std::endl;
        return false;
    }
    catch (const std::out_of_range &e){
        std::cerr << "Error: " << e.what() << std::endl;
        return false;
    }
    return true;
}

void BitcoinExchange::loadDatabase(const std::string &filename)
{
    std::ifstream ifs(filename.c_str());
    if (!ifs.is_open())
        throw std::runtime_error("could not open database file.");

    std::string line;
    std::getline(ifs, line);

    while (std::getline(ifs, line))
    {
        size_t commaPos = line.find(',');
        if (commaPos != std::string::npos)
        {
            std::string date = line.substr(0, commaPos);
            std::string priceStr = line.substr(commaPos + 1);

            std::stringstream ss(priceStr);
            float price;
            if (ss >> price)
                _data[date] = price;
        }
    }
}

void BitcoinExchange::processInputFile(const std::string &filename)
{
    std::ifstream ifs(filename.c_str());
    if (!ifs.is_open())
        throw std::runtime_error("could not open file.");

    std::string line;
    std::getline(ifs, line);

    while (std::getline(ifs, line))
    {
        std::string date;
        float value;
        if (parseLine(line, date, value))
        {
            std::map<std::string, float>::iterator it = _data.lower_bound(date);
            if (it == _data.end())
                it--;
            else if (it->first != date)
            {
                if (it != _data.begin())
                    it--;
                else
                {
                    std::cerr << "Error: no data available before " << date << std::endl;
                    continue;
                }
            }
            float rate = it->second;
            float result = value * rate;
            std::cout << date << " => " << value << " = " << result << std::endl;
        }
    }
}
