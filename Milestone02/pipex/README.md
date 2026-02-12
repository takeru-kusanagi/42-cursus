# pipex - Replicating Unix Pipes

The **pipex** project is a deep dive into Unix mechanisms, specifically focusing on how the shell handles pipes (`|`) and redirections (`<`, `>`).

The goal is to develop a program that mimics the behavior of the following shell command:

< file1 cmd1 | cmd2 > file2

This project is a deep dive into:

- Process creation  
- Inter-process communication (IPC)  
- File descriptor manipulation in C  

---

## 🛠 Features

The `pipex` program has the following characteristics:

### 🔹 Redirection Handling
Opens and manages input and output files correctly using:

- `open`
- `close`
- `dup2`

### 🔹 Inter-process Communication
Creates a pipe to allow the output of the first command to be passed as the input to the second command.

### 🔹 Command Execution
- Searches for executable paths in the `PATH` environment variable  
- Executes commands using `execve`

### 🔹 Error Management
- Handles `Command not found`  
- Handles `Permission denied`  
- Handles `No such file or directory`  
- Mimics standard shell behavior  

---

## 💡 Key Concepts Learned

### 🔹 Pipes
Understanding the `pipe()` system call and how it creates a unidirectional data channel between processes.

### 🔹 Process Forking
Using `fork()` to create child processes and managing execution flow properly.

### 🔹 File Descriptor Manipulation
Using `dup2()` to redirect:

- Standard input (`stdin`)  
- Standard output (`stdout`)  

to pipes and files.

### 🔹 Environment Variables
Parsing the `char **envp` argument of `main` to locate executable paths from the system `PATH`.

---

## 🚀 Usage

### Requirements

The program is written in **C** and requires:

- `cc` compiler  
- `make`

---

###  Compilation

Navigate to the project directory and run:

```bash
make
```

This will generate the `pipex` executable file.

---

###  Execution

The program is executed as follows:

```bash
./pipex file1 cmd1 cmd2 file2
```

### Example

```bash
./pipex infile "ls -l" "wc -l" outfile
```

This is equivalent to the shell command:

```bash
< infile ls -l | wc -l > outfile
```

---

## 📁 Project Structure

- `pipex.c` — Main logic, process forking, and pipe management  
- `utils.c` — Helper functions for path resolution and command execution  
- `pipex.h` — Prototypes and necessary headers  

---

Developed as part of the **42 Tokyo curriculum**.
