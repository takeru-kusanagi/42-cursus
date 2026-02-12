# so_long - Simple 2D Game Development

The **so_long** project is a 2D game developed using the **MiniLibX** (a simple C graphics library).

The goal is to create a small top-down adventure game where a player collects items and reaches an exit while navigating through a map.

This project is a deep dive into:

- Event-Driven Programming  
- Window Management  
- Resource Handling in a graphical environment  

---

## 🎮 Game Overview

The game follows strict rules and includes the following features:

### 🔹 Player Movement
Navigate through the map using:

- `W`
- `A`
- `S`
- `D`

### 🔹 Objectives
- Collect all **Collectibles**
- The **Exit** becomes accessible only after all items are collected

### 🔹 Map Parsing
Reads `.ber` files and validates that the map:

- Is rectangular  
- Is surrounded by walls  
- Contains at least:
  - One exit  
  - One collectible  
  - One starting position  

### 🔹 Move Counter
Displays the current number of movements:

- In the terminal  
- (Optional) On-screen  

### 🔹 Graphics Rendering
Renders `.xpm` textures for:

- Walls  
- Player  
- Collectibles  
- Floor  

---

## 🛠 Features & Technical Skills

### 🔹 MiniLibX Integration
- Window initialization  
- Image buffer handling  
- Color management  

### 🔹 Event Handling
Implementing hooks for:

- Keyboard inputs  
- Window close events (ESC key or clicking the X button)  

### 🔹 Path Validation (DFS / Flood Fill)
Using a **Depth-First Search (DFS)** algorithm during map parsing to ensure:

- All collectibles are reachable  
- The exit is reachable  

### 🔹 Memory Management
Ensuring that:

- All allocated images are destroyed  
- Window instances are properly freed  
- No memory leaks occur in a long-running graphical process  

---

## 🚀 Usage

### 🔧 Requirements

The program is written in **C** and requires:

- `cc` compiler  
- `make`  
- MiniLibX dependencies (X11 / OpenGL)  

---

### Compilation

Navigate to the project directory and run:

```bash
make
```

This will generate the `so_long` executable file.

---

###  Execution

Run the game by providing a valid map file:

```bash
./so_long maps/map.ber
```

---

## Project Structure

- `src/` — Game logic, event hooks, and rendering functions  
- `map_utils/` — Map parsing, validation, and pathfinding (flood fill)  
- `textures/` — XPM image assets for the game tiles  
- `include/` — Header files with prototypes and structures  

---

Developed as part of the **42 Tokyo curriculum**.
