# philosophers - Dining Philosophers Problem

philosophers is a project centered around the classic "Dining Philosophers" problem, 
a synchronization puzzle used to illustrate the challenges of concurrency and resource sharing in operating systems.

The goal is to implement a simulation where multiple threads (philosophers) must perform actions (eat, sleep, think) 
without starving to death or causing a system deadlock.

---

## 🛠 Features

### Multithreading
- Each philosopher is represented by a separate thread using the pthread library.

### Mutex Synchronization
- Uses mutexes (pthread_mutex_t) to represent forks, ensuring that no two philosophers can hold the same fork simultaneously.

### Precise Timing
- Implements a custom monitoring system to track time in milliseconds, ensuring that philosophers act and potentially die at the exact right moment.

### Death Monitoring
- A dedicated monitoring thread (or logic) checks the status of each philosopher to ensure the simulation stops immediately upon a philosopher's death.

---

## 💡 Key Concepts Learned

### Thread Lifecycle
- Creating, joining, and detaching threads
- Understanding the shared memory space between threads

### Deadlock Prevention
- Designing logic to ensure that a circular wait (where everyone holds one fork and waits for the other) never occurs

### Data Races & Thread Safety
- Using Valgrind (Helgrind/DRD) or ThreadSanitizer to identify and eliminate race conditions where multiple threads attempt to access shared data simultaneously

### Optimization of Resource Contention
- Fine-tuning the "thinking" and "sleeping" intervals to maximize the survival time of the philosophers under heavy resource competition

---

## 🚀 Usage

### Requirements
- Written in C
- Requires:
  - cc compiler
  - make

### Compilation
Navigate to the project directory and run:
make

### Execution
The program takes the following arguments:
number_of_philosophers time_to_die time_to_eat time_to_sleep [number_of_times_each_philosopher_must_eat]

Example:
./philo 5 800 200 200

This starts a simulation with 5 philosophers, where each will die if they don't start eating within 800ms of their last meal.

---

Developed as part of the 42 Tokyo curriculum.
