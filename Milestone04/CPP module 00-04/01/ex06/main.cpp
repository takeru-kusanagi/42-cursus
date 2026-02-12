
#include "Harl.hpp"

#include <iostream>
#include <string>

enum LogLevel {
    DEBUG_LEVEL = 0,
    INFO_LEVEL = 1,
    WARNING_LEVEL = 2,
    ERROR_LEVEL = 3,
    INVALID_LEVEL = 4
};

struct LevelMap {
    std::string name;
    LogLevel    level;
};

LevelMap level_mappings[] = {
    {"DEBUG",   DEBUG_LEVEL},
    {"INFO",    INFO_LEVEL},
    {"WARNING", WARNING_LEVEL},
    {"ERROR",   ERROR_LEVEL}
};

const size_t NUM_LEVELS = 4;

LogLevel get_level_index(const std::string& level) {
    for (size_t i = 0; i < NUM_LEVELS; ++i) {
        if (level_mappings[i].name == level) {
            return level_mappings[i].level;
        }
    }
    return INVALID_LEVEL;
}

void filter_harl_complaint(Harl& harl, const std::string& level) {
    LogLevel start_level = get_level_index(level);

    switch (start_level) {
        case DEBUG_LEVEL:
            harl.complain("DEBUG");
            //fallthrough
        case INFO_LEVEL:
            harl.complain("INFO");
            //fallthrough
        case WARNING_LEVEL:
            harl.complain("WARNING");
            //fallthrough
        case ERROR_LEVEL:
            harl.complain("ERROR");
            break;
        case INVALID_LEVEL:
        default:
            std::cout << "[ Probably complaining about insignificant problems ]" << std::endl;
            break;
    }
}

int main(int ac, char **av) {
    if (ac != 2) {
        std::cerr << "Usage: " << av[0] << " <DEBUG|INFO|WARNING|ERROR>" << std::endl;
        return 1;
    }
    Harl harl;
    filter_harl_complaint(harl, av[1]);
    return 0;
}
