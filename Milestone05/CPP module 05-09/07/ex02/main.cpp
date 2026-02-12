
#include <iostream>
#include <string>

#include "Array.hpp"

template <typename T>
void displayArray(const Array<T>& arr) {
    std::cout << "Content [size=" << arr.size() << "]: ";
    for (unsigned int i = 0; i < arr.size(); ++i) {
        try {
            std::cout << arr[i] << (i == arr.size() - 1 ? "" : ", ");
        } catch (const std::exception& e) {
            std::cout << "[Error]";
        }
    }
    std::cout << std::endl;
}

int main() {
    std::cout << "--- 1. Default Construction (Empty) ---" << std::endl;
    Array<int> empty_arr;
    displayArray(empty_arr);

    std::cout << "\n--- 2. Size Construction (Int) ---" << std::endl;
    Array<int> int_arr(5);
    displayArray(int_arr);
    int_arr[0] = 10;
    int_arr[4] = 99;
    std::cout << "Set values: ";
    displayArray(int_arr);

    std::cout << "\n--- 3. Copy Construction (Deep Copy Test) ---" << std::endl;
    Array<int> copied_arr(int_arr); //or copied_arr = int_arr;

    int_arr[0] = 500;
    std::cout << "Original (int_arr) modified." << std::endl;
    std::cout << "Original: "; displayArray(int_arr);
    std::cout << "Copied:   "; displayArray(copied_arr);

    std::cout << "\n--- 4. Assignment Operator (Deep Copy Test) ---" << std::endl;
    Array<int> assigned_arr;
    assigned_arr = int_arr;

    int_arr[1] = 777;
    std::cout << "Original (int_arr) modified again." << std::endl;

    std::cout << "Original: "; displayArray(int_arr);
    std::cout << "Assigned: "; displayArray(assigned_arr);

    std::cout << "\n--- 5. Exception Test ---" << std::endl;
    try {
        std::cout << "Accessing int_arr[4]: " << int_arr[4] << std::endl;
        std::cout << "Attempting to access int_arr[5] (OOB)..." << std::endl;
        int value = int_arr[5];
        std::cout << "This line should not be reached. Value: " << value << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Caught exception: " << e.what() << std::endl;
    }

    std::cout << "\n--- 6. String Array Test ---" << std::endl;
    Array<std::string> str_arr(3);
    str_arr[0] = "Hello";
    str_arr[1] = "Templates";
    displayArray(str_arr);
    return 0;
}
