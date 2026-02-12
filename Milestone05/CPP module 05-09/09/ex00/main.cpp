
#include "BitcoinExchange.hpp"
#include <cstdlib>

int main(int ac, char **av)
{
    if (ac != 2){
        std::cerr << "Usage: ./btc [input_file]" << std::endl;
        return 1;
    }
    try{
        BitcoinExchange btc;
        btc.loadDatabase("data.csv");
        btc.processInputFile(av[1]);
    }
    catch (const std::runtime_error &e){
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    catch (const std::exception &e){
        std::cerr << "An unexpected error occurred: " << e.what() << std::endl;
        return EXIT_FAILURE;
    }

    return 0;
}
