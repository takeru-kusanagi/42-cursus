
#include "Base.hpp"

int main() {
    Base* instances[5];

    std::cout << "--- [TEST 1] Generating 5 Random Instances ---" << std::endl;
    for (int i = 0; i < 5; ++i) {
        instances[i] = generate();
    }
    std::cout << "\n";

    std::cout << "--- [TEST 2] Testing Identification ---" << std::endl;
    for (int i = 0; i < 5; ++i) {
        std::cout << "[" << i + 1 << "] Target: " << std::endl;
        identify(instances[i]);
        identify(*(instances[i]));
        std::cout << std::endl;
    }

    std::cout << "--- [TEST 3] Error / Special Cases ---" << std::endl;

    std::cout << "[NULL Pointer Test]" << std::endl;
    Base* nullPtr = NULL;
    identify(nullPtr);

    std::cout << "\n[Pure Base Class Test (Unknown Type)]" << std::endl;
    Base* pureBase = new Base();
    identify(pureBase);
    identify(*pureBase);

    std::cout << "\n--- Cleaning up memory ---" << std::endl;
    for (int i = 0; i < 5; ++i) {
        delete instances[i];
    }
    delete pureBase;

    return 0;
}
