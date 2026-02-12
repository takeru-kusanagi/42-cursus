
#include <iostream>
#include <fstream>
#include <string>

std::string replace_string(std::string content, const std::string& s1, const std::string& s2) {
    if (s1.empty()) {
        return content;
    }
    size_t pos = 0;
    while ((pos = content.find(s1, pos)) != std::string::npos) {
        content.erase(pos, s1.length());
        content.insert(pos, s2);
        pos += s2.length();
    }
    return content;
}

int main(int ac, char **av) {
    if (ac != 4) {
        std::cerr << "Usage: " << av[0] << " <filename> <s1> <s2>" << std::endl;
        return 1;
    }
    std::string filename = av[1];
    std::string s1 = av[2];
    std::string s2 = av[3];

    std::ifstream inputFile(filename.c_str());
    if (!inputFile.is_open()) {
        std::cerr << "Error: Could not open input file " << filename << std::endl;
        return 1;
    }

    std::string content((std::istreambuf_iterator<char>(inputFile)),
                        std::istreambuf_iterator<char>());
    inputFile.close();

    std::string newContent = replace_string(content, s1, s2);

    std::string outputFilename = filename + ".replace";
    std::ofstream outputFile(outputFilename.c_str());
    if (!outputFile.is_open()) {
        std::cerr << "Error: Could not create/open output file " << outputFilename << std::endl;
        return 1;
    }
    outputFile << newContent;
    outputFile.close();
    std::cout << "Successfully replaced '" << s1 << "' with '" << s2 << "' in "
              << filename << " and saved to " << outputFilename << std::endl;
    return 0;
}
