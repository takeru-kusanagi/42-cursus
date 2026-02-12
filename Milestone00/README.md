# Libft - Custom C Library

The **Libft** project is the foundational milestone of the 42 cursus.  
It involves reimplementing a significant portion of the standard C library (`libc`) along with additional utility functions.

This project is designed to master:

- Pointers  
- Memory management (dynamic allocation)  
- String manipulation in C  

The resulting `libft.a` is a reusable static library that I utilize throughout my subsequent 42 projects.

---

## 🛠 Features

### 📌 Standard Libc Functions

Re-implementations of essential functions from the standard library, strictly adhering to the behavior described in their man pages:

#### 🔹 Memory Management
- `memset`
- `bzero`
- `memcpy`
- `memmove`
- `memchr`
- `memcmp`
- `calloc`

#### 🔹 String Manipulation
- `strlen`
- `strlcpy`
- `strlcat`
- `strchr`
- `strrchr`
- `strncmp`
- `strnstr`
- `strdup`

#### 🔹 Character Checks & Conversion
- `isalpha`
- `isdigit`
- `isalnum`
- `isascii`
- `isprint`
- `toupper`
- `tolower`
- `atoi`

---

### 📌 Non-Standard Utility Functions

Additional functions that extend basic functionality for easier data handling:

#### 🔹 String Processing
- `ft_substr`
- `ft_strjoin`
- `ft_strtrim`
- `ft_split`
- `ft_strmapi`
- `ft_striteri`

#### 🔹 Integer to String
- `ft_itoa`

#### 🔹 File Descriptor Output
- `ft_putchar_fd`
- `ft_putstr_fd`
- `ft_putendl_fd`
- `ft_putnbr_fd`

---

### 📌 Linked List Manipulation (Bonus)

A set of functions to handle singly linked lists using a custom `t_list` structure:

- `ft_lstnew`
- `ft_lstadd_front`
- `ft_lstsize`
- `ft_lstlast`
- `ft_lstadd_back`
- `ft_lstdelone`
- `ft_lstclear`
- `ft_lstiter`
- `ft_lstmap`

---

## 🚀 Usage

### 🔧 Requirements

The library is written in **C** and requires:

- `cc` compiler  
- `make`

---

### 🏗 Compilation

Navigate to the project directory and run:

```bash
# To compile the mandatory functions
make

# To compile with bonus (linked list) functions
make bonus
```

This will generate the `libft.a` static library file.

---

### 🔗 Integration

To use **Libft** in your own C project, include the header in your `.c` files and link the library during compilation:

```c
#include "libft.h"
```

```bash
cc my_project.c -L. -lft
```

---

Developed as part of the **42 Tokyo curriculum**.
