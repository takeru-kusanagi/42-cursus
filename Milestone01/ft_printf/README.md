# ft_printf - Custom Printf Function

The **ft_printf** project is a significant challenge in the 42 cursus that requires recreating the functionality of the standard C library's `printf()` function.

The primary objective is to master **variadic functions in C** and handle complex string formatting and buffer management.

By completing this project, I gained a deep understanding of:

- How functions handle an unknown number of arguments  
- How data types are represented in memory  

---

## 🛠 Features

The `ft_printf` function mimics the behavior of the original `printf` and supports the following format specifiers:

| Specifier | Description |
|------------|------------|
| `%c` | Prints a single character. |
| `%s` | Prints a string (character array). |
| `%p` | Prints a `void *` pointer address in hexadecimal format. |
| `%d` | Prints a signed decimal integer. |
| `%i` | Prints a signed integer in base 10. |
| `%u` | Prints an unsigned decimal integer. |
| `%x` | Prints a number in lowercase hexadecimal format. |
| `%X` | Prints a number in uppercase hexadecimal format. |
| `%%` | Prints a literal percent sign. |

---

## 💡 Key Concepts Learned

### 🔹 Variadic Functions
Utilizing `<stdarg.h>` macros:

- `va_start`
- `va_arg`
- `va_copy`
- `va_end`

to process a variable number of arguments.

### 🔹 Argument Parsing
Manually parsing format strings to identify specifiers and handle data types accordingly.

### 🔹 Base Conversion
Implementing custom logic to convert integers into hexadecimal (both upper and lower case) for:

- `%p`
- `%x`
- `%X`

---

## 🚀 Usage

### 🔧 Requirements

The function is written in **C** and requires:

- `cc` compiler  
- `make`

---

### 🏗 Compilation

Navigate to the project directory and run:

```bash
make
```

This will generate the `libftprintf.a` static library file.

---

### 🔗 Integration

To use `ft_printf` in your own project, include the header and link the library during compilation:

```c
#include "ft_printf.h"

int main()
{
    ft_printf("Hello %s! The answer is %d.\n", "World", 42);
    return (0);
}
```

```bash
cc main.c -L. -lftprintf
```

---

Developed as part of the **42 Tokyo curriculum**.
