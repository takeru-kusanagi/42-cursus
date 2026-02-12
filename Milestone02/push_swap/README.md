# push_swap - Complexity Optimized Sorting

The **push_swap** project is an algorithmic challenge that requires sorting a stack of integers using a limited set of instructions and the smallest possible number of operations.

The goal is to develop a highly efficient sorting algorithm that prioritizes **operation count (complexity)** over execution time.

This project is a deep dive into:

- Data Structures  
- Sorting Algorithms  
- Algorithm Optimization  

---

## 🛠 Features

The `push_swap` program has the following characteristics:

### 🔹 Two-Stack System
Uses two stacks:

- Stack `a`
- Stack `b`

to manipulate and sort data.

### 🔹 Limited Instruction Set
Operates using only the following moves:

**Swap**
- `sa`
- `sb`
- `ss`

**Push**
- `pa`
- `pb`

**Rotate**
- `ra`
- `rb`
- `rr`

**Reverse Rotate**
- `rra`
- `rrb`
- `rrr`

### 🔹 High Efficiency
Optimized to pass strict benchmarks:

- 100 numbers in **< 700 moves**
- 500 numbers in **< 5500 moves**

### 🔹 Input Validation
Handles:

- Duplicate numbers  
- Non-numeric input  
- Integer overflow  

---

## 💡 Key Concepts Learned

### 🔹 Algorithm Selection
Implementing and comparing different sorting strategies such as:

- Quick Sort (adapted logic)  
- Radix Sort  
- Custom "Turk" algorithms  

All adapted to stack-based constraints.

### 🔹 Complexity Analysis
Understanding how operation count grows with input size:

- $O(n^2)$  
- $O(n \log n)$  

### 🔹 Data Structure Design
Efficiently managing stacks using:

- Linked lists  
- Arrays  

Ensuring $O(1)$ operations for pushes and swaps.

### 🔹 Optimization
Fine-tuning the algorithm to determine the **"cheapest" element to move** based on:

- Its current position  
- Its target position in the other stack  

---

## 🚀 Usage

### 🔧 Requirements

The program is written in **C** and requires:

- `cc` compiler  
- `make`

---

### Compilation

Navigate to the project directory and run:

```bash
make
```

This will generate the `push_swap` executable file.

---

### Execution

Run the program with a list of integers:

```bash
./push_swap 2 1 3 6 5 8
```

---

### Count the Number of Operations

```bash
ARG="4 67 3 87 23"; ./push_swap $ARG | wc -l
```

---

### Visualization (Optional)

You can use a third-party visualizer to see the stacks in action:

```bash
ARG=$(ruby -e "puts (1..100).to_a.shuffle.join(' ')"); ./push_swap $ARG | ./checker_linux $ARG
```

---

Developed as part of the **42 Tokyo curriculum**.
