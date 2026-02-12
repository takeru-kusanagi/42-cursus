# CPP Modules 00-04 - Introduction to Object-Oriented Programming

This series of modules marks the transition from C to C++, focusing on the core principles of Object-Oriented Programming (OOP).  
The curriculum emphasizes a deep understanding of class design, memory allocation, and the "C++ way" of solving problems while adhering to the strict C++98 standard.

---

## 🛠 Modules Overview

### Module 00: Basics & Syntax
- Focuses on basic syntax, classes, member functions, and standard streams
- **Key Project:** A simple Phonebook CLI application
- **Concepts:** Namespaces, Class declaration, I/O streams (iostream)

### Module 01: Memory Allocation & Pointers
- Explores heap vs. stack allocation and the use of pointers and references
- **Key Project:** Implementing a "Zombie" system and a "Harl" complaint system
- **Concepts:** new/delete, References, File streams (fstream), Pointers to members

### Module 02: Ad-hoc Polymorphism & Canonical Form
- Introduction to operator overloading and fixed-point numbers
- **Concepts:** Orthodox Canonical Class Form (Default constructor, Copy constructor, Copy assignment operator, Destructor), Operator overloading, Fixed-point arithmetic

### Module 03: Inheritance
- Understanding how to build hierarchical relationships between classes
- **Key Project:** Creating "ClapTrap," "ScavTrap," and "FragTrap" combat robots
- **Concepts:** Public/Private/Protected inheritance, Constructor/Destructor calling order

### Module 04: Subtype Polymorphism & Interfaces
- Mastering the core of OOP: Polymorphism and abstract classes
- **Key Project:** An Animal farm simulation with specific behaviors for Dogs and Cats
- **Concepts:** Virtual functions, Pure virtual functions, Abstract classes, Interfaces, Deep vs. Shallow copying

---

## 💡 Key Concepts Learned

- **Orthodox Canonical Class Form:** Ensuring every class is robust and handles memory correctly during copying and assignment
- **Encapsulation:** Protecting data integrity by using access specifiers (public, private, protected)
- **Polymorphism:** Using virtual destructors and member functions to ensure the correct derived class behavior is triggered at runtime
- **Resource Acquisition Is Initialization (RAII):** Managing resources (like memory) by tying them to the lifetime of objects

---

## 🚀 Usage

### Requirements
- Compiled using `c++` with the `-std=c++98` flag to ensure strict standard compliance

### Compilation
Each module contains multiple exercises. Navigate to an exercise directory and run:
make

### Execution
Example (Module 04):
./polymorphism_test

---

Developed as part of the 42 Tokyo curriculum.
