
#include "Span.hpp"

#include <iostream>
#include <cstdlib>
#include <ctime>
#include <list>
#include <numeric>
#include <limits>

void print_test_result(const std::string& testName, bool success) {
    std::cout << (success ? "[SUCCESS] " : "[FAILURE] ") << testName << std::endl;
}

typedef void (*TestFunction)();

void test_runner(const std::string& title, TestFunction func) {
    std::cout << "\n--- " << title << " ---" << std::endl;
    try {
        func();
    } catch (const std::exception& e) {
        std::cerr << "[FAILURE] Test failed unexpectedly: " << e.what() << std::endl;
    }
}

void mandatory_and_shortest_span_check() {
    std::cout << "  1-A. Mandatory Test (6, 3, 17, 9, 11)" << std::endl;
    Span sp1 = Span(5);
    sp1.addNumber(6); sp1.addNumber(3); sp1.addNumber(17); sp1.addNumber(9); sp1.addNumber(11);

    long shortest1 = sp1.shortestSpan();
    long longest1 = sp1.longestSpan();
    std::cout << "    Shortest Span: " << shortest1 << ", Longest Span: " << longest1 << std::endl;
    print_test_result("Mandatory Spans (Expected 2 & 14)", shortest1 == 2 && longest1 == 14);

    std::cout << "  1-B. Shortest Span requires sort (1, 100, 102)" << std::endl;
    Span sp2 = Span(3);
    sp2.addNumber(1); sp2.addNumber(100); sp2.addNumber(102);

    long shortest2 = sp2.shortestSpan();
    long longest2 = sp2.longestSpan();
    std::cout << "    Shortest Span: " << shortest2 << ", Longest Span: " << longest2 << std::endl;
    print_test_result("Shortest Span Proof (Expected 2 & 101)", shortest2 == 2 && longest2 == 101);
}

void range_add_test() {
    const unsigned int N = 10;
    Span sp(N);

    std::cout << "  2-A. Adding from std::vector" << std::endl;
    std::vector<int> v;
    for (int i = 0; i < 5; ++i) {
        v.push_back(100 + i);
    }
    sp.addRange(v.begin(), v.end());
    long shortest2A = sp.shortestSpan();
    long longest2A = sp.longestSpan();
    print_test_result("Vector Add (Shortest 1, Longest 4)", shortest2A == 1 && longest2A == 4);

    std::cout << "  2-B. Adding from std::list (Combined Span check)" << std::endl;
    std::list<int> l;
    l.push_back(0);
    l.push_back(1000);
    sp.addRange(l.begin(), l.end());

    long shortest2B = sp.shortestSpan();
    long longest2B = sp.longestSpan();
    std::cout << "    Current size: " << N << " (Max), Shortest Span: " << shortest2B << ", Longest Span: " << longest2B << std::endl;
    print_test_result("List Add & Combined Span (Shortest 1, Longest 1000)", shortest2B == 1 && longest2B == 1000);
}

void stress_and_exception_boundary_check() {
    std::srand(std::time(0));
    const unsigned int N = 10000;

    std::cout << "  3-A. Stress Test (N=10000)" << std::endl;
    try {
        Span sp(N);
        std::vector<int> hugeVec;

        hugeVec.push_back(std::numeric_limits<int>::min());
        hugeVec.push_back(std::numeric_limits<int>::max());

        for (unsigned int i = 0; i < N - 2; ++i) {
            hugeVec.push_back(std::rand());
        }

        sp.addRange(hugeVec.begin(), hugeVec.end());
        std::cout << "    Successfully added " << hugeVec.size() << " numbers." << std::endl;
        long longest = sp.longestSpan();
        print_test_result("Stress Test (Longest > 4 Billion)", longest > 4000000000L);
    } catch (const std::exception& e) {
        std::cerr << "[FAILURE] Stress Test failed: " << e.what() << std::endl;
    }

    std::cout << "  3-B. Max Capacity Exception (addNumber)" << std::endl;
    bool cap_success = false;
    try {
        Span sp(2);
        sp.addNumber(1); sp.addNumber(2); sp.addNumber(3);
    } catch (const Span::MaxCapacityReachedException& e) {
        std::cerr << "    Caught: " << e.what() << std::endl;
        cap_success = true;
    } catch (const std::exception& e) {}
    print_test_result("Capacity Check (addNumber)", cap_success);

    std::cout << "  3-C. Max Capacity Exception (addRange)" << std::endl;
    bool range_cap_success = false;
    try {
        Span sp(5);
        sp.addNumber(1); sp.addNumber(2);
        std::vector<int> overflowVec(4, 5);
        sp.addRange(overflowVec.begin(), overflowVec.end());
    } catch (const Span::MaxCapacityReachedException& e) {
        std::cerr << "    Caught: " << e.what() << std::endl;
        range_cap_success = true;
    } catch (const std::exception& e) {}
    print_test_result("Capacity Check (addRange)", range_cap_success);

    std::cout << "  3-D. No Span Found Exception" << std::endl;
    bool no_span_success = false;
    try {
        Span empty_sp(1);
        empty_sp.shortestSpan();
    } catch (const Span::NoSpanCanBeFoundException& e) {
        no_span_success = true;
    }
    try {
        Span one_sp(2);
        one_sp.addNumber(10);
        one_sp.longestSpan();
    } catch (const Span::NoSpanCanBeFoundException& e) {
        if (no_span_success) no_span_success = true;
    }
    print_test_result("No Span Found Check (0 and 1 element)", no_span_success);
}

int main() {
    test_runner("1. Basic & Shortest Span Logic Check", mandatory_and_shortest_span_check);
    test_runner("2. Improved AddNumber (addRange) Tests", range_add_test);
    test_runner("3. Stress and Exception Boundary Tests", stress_and_exception_boundary_check);
    return 0;
}
