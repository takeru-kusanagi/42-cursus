
#include "Serializer.hpp"
#include "Data.hpp"
#include <iomanip>

int main() {
    Data* originalPtr = new Data(42, "The Answer");
    std::cout << "--- 1. Data Object ---" << std::endl;
    std::cout << "Original Data value: " << originalPtr->value << std::endl;
    std::cout << "Original Data identifier: " << originalPtr->identifier << std::endl;
    std::cout << "Original Pointer address: " << originalPtr << std::endl;
    std::cout << "Original Pointer as hex: " << std::hex << originalPtr << std::dec << std::endl;

    std::cout << "-----------------------------------" << std::endl;

    uintptr_t serializedValue = Serializer::serialize(originalPtr);
    std::cout << "--- 2. serialize() Execution ---" << std::endl;
    std::cout << "Serialized Value (uintptr_t): " << serializedValue << std::endl;
    std::cout << "Serialized Value (hex): 0x" << std::hex << serializedValue << std::dec << std::endl;

    std::cout << "-----------------------------------" << std::endl;

    Data* deserializedPtr = Serializer::deserialize(serializedValue);
    std::cout << "--- 3. deserialize() Execution ---" << std::endl;
    std::cout << "Deserialized Pointer address: " << deserializedPtr << std::endl;
    std::cout << "Deserialized Pointer as hex: " << std::hex << deserializedPtr << std::dec << std::endl;

    std::cout << "-----------------------------------" << std::endl;

    std::cout << "--- 4. Results ---" << std::endl;
    if (originalPtr == deserializedPtr) {
        std::cout << "**SUCCESS!** Original pointer equals deserialized pointer." << std::endl;
        std::cout << "Accessing data via deserialized pointer: " << deserializedPtr->identifier << std::endl;
    } else {
        std::cout << "**FAILURE!** Pointers do not match." << std::endl;
    }

    delete originalPtr;

    return 0;
}
