# ft_irc - Internet Relay Chat Server

ft_irc is a project that involves creating an IRC server from scratch using C++98.  
The server is designed to be fully compatible with official IRC clients and follows the RFC 1459 and RFC 2812 protocols.

The core challenge of this project is managing multiple concurrent connections without using threads, relying instead on I/O multiplexing.

---

## 🛠 Features

### Socket Communication
- Handles multiple client connections simultaneously using a single-process, non-blocking model

### Authentication
- Implements a password-protected entry system for security

### User Management
- Supports nicknames, real names, and user modes

### Channel Operations
- Joining and leaving channels (JOIN, PART)
- Channel operator privileges (KICK, INVITE, TOPIC, MODE)
- Private messaging (PRIVMSG) and notices (NOTICE)

### Command Parsing
- A custom engine to parse complex IRC protocol messages and parameters

---

## 💡 Key Concepts Learned

### I/O Multiplexing
- Mastering the `poll()` (or `select`/`kqueue`) system calls to handle multiple file descriptors in a single thread, ensuring high performance and low resource consumption

### Non-blocking I/O
- Configuring sockets to `O_NONBLOCK` and managing partial reads/writes using custom buffers

### Network Protocols
- Deep diving into the TCP/IP stack and the application-layer IRC protocol

### State Machines
- Designing a robust system to track the "state" of each client (e.g., Connected, Authenticated, Registered)

### Robust Error Handling
- Properly managing sudden disconnections, buffer overflows, and malformed packets

---

## 🚀 Usage

### Requirements
- Written in C++98
- Requires `c++` compiler and `make`

### Compilation
Navigate to the project directory and run:
make

### Execution
Start the server by specifying a port and a password:
./ircserv <port> <password>

**Example:**
./ircserv 6667 my_secure_password

### Connection
You can connect to your server using a standard IRC client or `nc` (Netcat):

```bash
# Using Netcat
nc -c localhost 6667
PASS my_secure_password
NICK guest
USER guest 0 * :Real Name

