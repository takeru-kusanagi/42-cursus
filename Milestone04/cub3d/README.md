# cub3d - Raycasting Engine

cub3d is a graphics project that involves creating a realistic 3D graphical representation of a maze from a first-person perspective. 
It uses the Raycasting technique—the same method used in legendary games like Wolfenstein 3D.  

This project focuses on Mathematics (Trigonometry), Performance Optimization, and Efficient Graphical Rendering using the MiniLibX library.

---

## 🎮 Features

### Real-time 3D Rendering
- Smooth first-person navigation through a 2D map

### Wall Textures
- Different textures for North, South, East, and West walls to provide spatial orientation

### Floor & Ceiling Coloring
- Custom environment colors as specified in the configuration file

### Collision Detection
- Prevents the player from walking through walls

### Map Parsing
- Rigorous validation of .cub files (map structure, textures, and RGB colors)

### Event Handling
- Smooth movement and rotation using keyboard inputs
- Clean window management

---

## 💡 Key Concepts Learned

### Raycasting Mathematics
- Utilizing distance formula `dist = sqrt((x2 - x1)^2 + (y2 - y1)^2)` and trigonometric functions to calculate distance to walls and projected height on screen

### Digital Differential Analyzer (DDA)
- Implementing the DDA algorithm to find exact intersections of rays with grid lines efficiently

### Fisheye Distortion Correction
- Correcting distance calculations using the player’s view angle to prevent "wall curving" effects

### Texture Mapping
- Calculating the exact pixel of a texture to display based on where the ray hits the wall

### Buffer Rendering
- Managing a pixel buffer to render the entire frame at once, ensuring a flicker-free, high-FPS experience

---

## 🚀 Usage

### Requirements
- Written in C
- Requires:
  - cc compiler
  - make
  - MiniLibX dependencies

### Compilation
Navigate to the project directory and run:
make

### Execution
Run the program with a valid map configuration:
./cub3D maps/classic.cub

### Controls
- W, A, S, D: Move the player
- Left / Right Arrows: Rotate the camera
- ESC: Close the game

---

Developed as part of the 42 Tokyo curriculum.
