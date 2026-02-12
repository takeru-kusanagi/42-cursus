# CPP Modules 05-09 - Advanced C++ & STL

This second half of the C++ curriculum shifts focus toward robustness, abstraction, and efficiency.  
It covers advanced features like Exception Handling, Templates, and the Standard Template Library (STL), ensuring the ability to write professional-grade, reusable C++ code.

---

## 🛠 Modules Overview

### Module 05: Exceptions
- Moving beyond error codes to a structured error-handling mechanism
- **Concepts:** try-catch blocks, Custom Exception classes, Standard exceptions
- **Key Project:** A bureaucratic system with forms that require specific grades to sign and execute

### Module 06: Type Casting
- Understanding the different ways C++ handles data type conversions
- **Concepts:** static_cast, dynamic_cast, reinterpret_cast, const_cast, and RTTI (Run-Time Type Identification)

### Module 07: Templates
- Introduction to Generic Programming
- **Concepts:** Function templates, Class templates, Specialization
- **Goal:** Creating reusable functions and classes (like a generic Array class) that work with any data type

### Module 08: STL Containers & Algorithms
- Leveraging the power of the Standard Template Library
- **Concepts:** Containers (vector, list, map, deque), Iterators, and Algorithms (std::for_each, std::find, std::transform)

### Module 09: STL Mastery & Problem Solving
- Practical application of containers to solve complex algorithmic problems
- **Key Projects:**
  - Bitcoin Exchange: Efficiently searching and parsing large CSV databases using std::map
  - RPN (Reverse Polish Notation): Using std::stack for mathematical expression evaluation
  - PmergeMe: Implementing the Merge-Insertion Sort (Ford-Johnson algorithm) and comparing performance between different containers (vector vs deque)

---

## 💡 Key Concepts Learned

- **Generic Programming:** Writing code that is independent of any particular type, leading to highly reusable libraries
- **Standard Template Library (STL):** Choosing the right container for the right job based on time complexity (O(n)) for insertion, deletion, and access
- **Exception Safety:** Ensuring programs remain in a valid state even when unexpected errors occur (avoiding memory leaks during stack unwinding)
- **Advanced Algorithm Implementation:** Implementing complex sorting and parsing logic using standard containers and iterators

---

## 🚀 Usage

### Requirements
- Compiled with: `c++ -std=c++98 -Wall -Wextra -Werror`

### Compilation
Navigate to the module directory and run:
make

### Execution
Example (Module 09 - Bitcoin Exchange):
./btc input.txt

---

Developed as part of the 42 Tokyo curriculum.
