# ft_printf Project

## Introduction

This `ft_printf` project is a mandatory assignment at 42 that involves recreating the functionality of the standard C library's `printf()` function.
The primary goal is to gain a deep understanding of variadic functions, argument parsing, string manipulation, and buffer management in C.

The project requires implementing a custom `ft_printf()` function that handles various format specifiers and flags, mimicking the behavior of the original `printf()` function as described in its man page.

## Features Implemented

The `ft_printf` function aims to handle the following standard format specifiers:

* `%c`: Prints a single character.
* `%s`: Prints a string (character array).
* `%p`: Prints the `void *` argument in hexadecimal format (pointer address).
* `%d` / `%i`: Prints a signed decimal integer.
* `%u`: Prints an unsigned decimal integer.
* `%x`: Prints a number in lowercase hexadecimal format.
* `%X`: Prints a number in uppercase hexadecimal format.
* `%%`: Prints a literal percent sign.

## Makefile Requirements

* Create a Makefile with rules for compiling and creating a static library file containing all mandatory functions.
* The Makefile should include standard targets like all, clean, fclean, and re.
