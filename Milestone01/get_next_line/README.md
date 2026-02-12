# get_next_line

# get_next_line Project

## Introduction

The get_next_line project is a challenging and fundamental assignment at 42 (Ecole 42). Its primary goal is to write a function, get_next_line, that reads a line from a file descriptor, ending with a newline character (\n) or EOF. This project is crucial for understanding file I/O operations, static variables, memory management, and buffer handling in C.

The function must be able to read from any file descriptor, one line at a time, without losing any part of the file. It should also be robust enough to handle various edge cases, such as empty files, files without newlines, and multiple calls to the function.

## Features
The get_next_line function has the following prototype:

char *get_next_line(int fd);

* It reads from the given file descriptor fd.
* It returns a line that has been read, including the terminating newline character (\n), except if the end of file (EOF) is reached and there is no newline.
* It returns NULL if an error occurs or if there's nothing left to read.
* The function should manage its internal buffer to read data efficiently and handle subsequent calls correctly.
* The BUFFER_SIZE macro determines the size of the buffer used for reading.

## How to Build
To compile the get_next_line function, you will typically compile it along with your main program. This project does not usually create a static library (.a) like libft or ft_printf, but rather compiles directly with your test files.

Assuming you have get_next_line.c, get_next_line_utils.c (if applicable), and get_next_line.h in your project directory, and main.c is your test file:

Note on BUFFER_SIZE: The BUFFER_SIZE macro is crucial for this project. It can be defined during compilation using the -D flag (e.g., -D BUFFER_SIZE=42). Different BUFFER_SIZE values should be tested to ensure robustness.

## How to Use
To use get_next_line in your own C projects:

1. Include the header:
Add #include "get_next_line.h" at the top of your C source file.
2. Call the function:
Pass a valid file descriptor to get_next_line. Remember to free the returned line when you are done with it, as it is dynamically allocated.
