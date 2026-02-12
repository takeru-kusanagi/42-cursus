# minishell - As Beautiful as a Shell

minishell is a collaborative project at 42 that involves creating a simplified version of the Bash shell.
It is one of the most significant milestones in the curriculum, requiring a deep understanding of Unix processes, system calls, and complex data parsing.

This project demonstrates the ability to build a robust, user-interactive CLI application that handles concurrent processes and system-level communication.

---

## 🛠 Features

### Command Execution
- Executes binaries from the PATH
- Supports absolute and relative paths

### Built-ins
Re-implementation of essential shell commands:
- echo (with -n)
- cd
- pwd
- export
- unset
- env
- exit

### Redirections & Pipes
- Input/output redirections:
  - <
  - >
  - >>
- Heredoc:
  - <<
- Multi-stage pipes (|) allowing data flow between multiple commands

### Environment Variables
- Handles expansion of variables:
  - $USER
  - $HOME
  - $? (exit status)

### Signal Handling
Mimics Bash behavior for:
- Ctrl-C → New prompt
- Ctrl-D → EOF / exit
- Ctrl-\ → Do nothing / quit

Supports both interactive and child-process modes.

### History
- Integrated command history using the readline library

---

## 💡 Key Concepts Learned

### Lexing/Parsing Cycle
- Tokenizing input strings
- Building an Abstract Syntax Tree (AST) or command execution table

### Process Management
- Mastering fork()
- Using waitpid()
- Managing child process life cycles
- Preventing zombie processes

### Inter-Process Communication (IPC)
- Orchestrating multiple pipes
- Managing file descriptors properly
- Avoiding "Resource temporarily unavailable" errors

### Signal Management
- Handling signals across parent and child processes
- Keeping the terminal stable

### Memory & Resource Leak Prevention
- Proper cleanup of file descriptors
- Preventing heap memory leaks in a long-running loop

---

## 🚀 Usage

### Requirements
- Written in C
- Requires:
  - cc compiler
  - make
  - readline library

### Compilation
Navigate to the project directory and run:
make

### Execution
Start the shell:
./minishell

Once inside, you can run commands just like in Bash:
minishell> ls -l | grep ".c" > output.txt
minishell> export MY_VAR=42
minishell> echo $MY_VAR

---

Developed as part of the 42 Tokyo curriculum.
