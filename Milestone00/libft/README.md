# Libft Project

This project, known as "Libft" at 42, is a foundational programming assignment that requires the recreation of a set of functions from the standard C library (libc). The primary goal is to deepen understanding of C programming fundamentals, including pointers, memory management, and string manipulation, by reimplementing core standard library functions. It also aims to familiarize students with official documentation (man pages) and the process of building a reusable static library.

All recreated functions must have the same prototypes and behaviors as their originals, with the only difference being that their names will start with the 'ft_' prefix.

## Mandatory Part

The mandatory part involves recreating several standard libc functions. You must ensure their implementations strictly adhere to the behavior described in their respective man pages.

**Functions to be implemented include, but are not limited to:**

### Character Manipulation
* `ft_isalpha`
* `ft_isdigit`
* `ft_isalnum`
* `ft_isascii`
* `ft_isprint`
* `ft_toupper`
* `ft_tolower`

### String Manipulation
* `ft_strlen`
* `ft_strlcpy`
* `ft_strlcat`
* `ft_strchr`
* `ft_strrchr`
* `ft_strncmp`
* `ft_strnstr`
* `ft_strdup`
* `ft_substr`
* `ft_strjoin`
* `ft_strtrim`
* `ft_split`
* `ft_itoa`
* `ft_strmapi`
* `ft_striteri`
* `ft_putchar_fd`
* `ft_putstr_fd`
* `ft_putendl_fd`
* `ft_putnbr_fd`

### Memory Manipulation
* `ft_memset`
* `ft_bzero`
* `ft_memcpy`
* `ft_memmove`
* `ft_memchr`
* `ft_memcmp`
* `ft_calloc`

### Additional Functions
* `ft_atoi`

### Makefile Requirements
* Create a `Makefile` with rules for compiling and creating a static library file (`libft.a`) containing all mandatory functions.
* The `Makefile` should include standard targets like `all`, `clean`, `fclean`, and `re`.

## Bonus Part (Optional)

The bonus part includes developing additional functions to manipulate singly linked lists.

**Linked List Functions:**

* **Structure Definition**:
    * Create and declare a custom structure called `t_list` with the following members:
        * `void *content`: Pointer to the data stored in the node.
        * `struct s_list *next`: Pointer to the next node in the list, or `NULL` if it's the last node.
* **Functions to be implemented:**
    * `ft_lstnew`
    * `ft_lstadd_front`
    * `ft_lstsize`
    * `ft_lstlast`
    * `ft_lstadd_back`
    * `ft_lstdelone`
    * `ft_lstclear`
    * `ft_lstiter`
    * `ft_lstmap`

### Makefile Requirements (Bonus)
* Add a `make bonus` rule to your `Makefile` to include these bonus functions in the `libft.a` library.
