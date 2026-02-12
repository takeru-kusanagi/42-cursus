
#include "MutantStack.hpp"

#include <iostream>
#include <list>
#include <vector>
#include <string>
#include <sstream>

void print_test_result(const std::string& testName, bool success) {
    std::cout << (success ? "[SUCCESS] " : "[FAILURE] ") << testName << std::endl;
}

std::string to_string_c98(int value) {
    std::stringstream ss;
    ss << value;
    return ss.str();
}

void mandatory_and_ocf_test() {
    std::cout << "\n--- 1. Mandatory & OCF Test (Default std::deque) ---" << std::endl;

    MutantStack<int> mstack;

    mstack.push(5);
    mstack.push(17);

    std::cout << "Top element (Expected 17): " << mstack.top() << std::endl;
    mstack.pop();
    std::cout << "Size after pop (Expected 1): " << mstack.size() << std::endl;

    mstack.push(3);
    mstack.push(5);
    mstack.push(737);
    mstack.push(0);

    MutantStack<int> mstack_copy(mstack);

    MutantStack<int> mstack_assign;
    mstack_assign = mstack;

    std::cout << "Elements via iterator (Expected: 5 3 5 737 0):" << std::endl;
    MutantStack<int>::iterator it = mstack.begin();
    MutantStack<int>::iterator ite = mstack.end();

    std::string output = "";
    while (it != ite) {
        std::cout << *it << " ";
        output += to_string_c98(*it);
        ++it;
    }
    std::cout << std::endl;

    bool ocf_check = mstack.top() == mstack_copy.top() && mstack.top() == mstack_assign.top();

    print_test_result("OCF and std::stack functions", ocf_check);
	print_test_result("Iteration (FIFO order of underlying container)", output == "5357370");
}

void comparison_test() {
    std::cout << "\n--- 2. Better Test: Comparison with std::list ---" << std::endl;

    MutantStack<int> mstack;
    std::list<int> list;

    mstack.push(42); mstack.push(10); mstack.push(99);
    list.push_back(42); list.push_back(10); list.push_back(99);

    MutantStack<int>::iterator mit = mstack.begin();
    std::list<int>::iterator lit = list.begin();

    bool match = true;
    while (mit != mstack.end() && lit != list.end()) {
        if (*mit != *lit) {
            match = false;
            break;
        }
        ++mit;
        ++lit;
    }
    if (mstack.size() != list.size()) match = false;

    print_test_result("Output matches std::list (Proof of correct iteration)", match);
}

void advanced_test() {
    std::cout << "\n--- 3. Better Test: Different Container & Reverse Iterators ---" << std::endl;

    MutantStack<int, std::vector<int> > vec_stack;
    vec_stack.push(1);
    vec_stack.push(2);
    vec_stack.push(3);

    std::cout << "Reverse iteration (Expected: 3 2 1): ";
    std::string reverse_output = "";
    MutantStack<int, std::vector<int> >::reverse_iterator rit = vec_stack.rbegin();
    while (rit != vec_stack.rend()) {
        std::cout << *rit << " ";
        reverse_output += to_string_c98(*rit);
        ++rit;
    }
    std::cout << std::endl;

    const MutantStack<int, std::vector<int> > const_stack = vec_stack;
    MutantStack<int, std::vector<int> >::const_iterator cit = const_stack.begin();

    bool const_check = (*cit == 1);

    print_test_result("Reverse Iterator Check", reverse_output == "321");
    print_test_result("Different Container (std::vector) & Const Check", const_check);
}

int main() {
    mandatory_and_ocf_test();
    comparison_test();
    advanced_test();
    return 0;
}
