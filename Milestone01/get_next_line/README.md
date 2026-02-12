# get_next_line - Reading from a File Descriptor

The **get_next_line** project is a fundamental assignment at 42 that involves creating a function to read a line from a file descriptor.

The primary challenge is to handle reading one line at a time while efficiently managing memory and buffer states between successive function calls.

This project is a deep dive into:

- Static variables  
- File I/O operations  
- Dynamic memory allocation in C  

---

## 🛠 Features

The `get_next_line` function has the following characteristics:

### 🔹 Line-by-Line Reading
Returns one line at a time from a file descriptor (`fd`), including the newline character `\n` (if present).

### 🔹 Versatile Input
Can read from:
- Files  
- Standard input  
- Network sockets  

### 🔹 Efficient Buffering
Uses a configurable `BUFFER_SIZE` to manage how much data is read in a single system call.

### 🔹 Memory Safe
- Returns `NULL` on error or EOF  
- Ensures no memory leaks occur during the process  

---

## 💡 Key Concepts Learned

### 🔹 Static Variables
Using `static` to preserve the "remainder" of a buffer between function calls, ensuring no data is lost when multiple lines are present in a single read.

### 🔹 File Descriptors
Mastering `read()` and understanding how file offsets work.

### 🔹 Buffer Management
Balancing `BUFFER_SIZE` performance—ensuring the function works whether the buffer is:

- 1 byte  
- 42 bytes  
- 10,000,000 bytes  

### 🔹 Manual Memory Handling
Meticulous use of `malloc` and `free` to prevent heap fragmentation or leaks.

---

## 🚀 Usage

### 🔧 Requirements

The function is written in **C** and requires:

- `cc` compiler  

---

###  Compilation

Since `get_next_line` is usually compiled directly with your source code (rather than as a library), use the following command:

```bash
cc -Wall -Wextra -Werror -D BUFFER_SIZE=42 main.c get_next_line.c get_next_line_utils.c -o gnl_test
```

> 💡 Note: The `BUFFER_SIZE` can be modified during compilation using the `-D` flag to test different reading behaviors.

---

### Integration

To use it in your project:

```c
#include "get_next_line.h"
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>

int main()
{
    int     fd;
    char    *line;

    fd = open("test.txt", O_RDONLY);
    if (fd < 0)
        return (1);
    while ((line = get_next_line(fd)) != NULL)
    {
        printf("%s", line);
        free(line); // Essential to avoid memory leaks
    }
    close(fd);
    return (0);
}
```

---

Developed as part of the **42 Tokyo curriculum**.
