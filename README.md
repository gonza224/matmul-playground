# Matrix Multiplication Parallel Visualization Tool

We present a web application for visualizing parallel algorithms, focusing on matrix multiplication. By using WebSockets to connect C++ code executing OpenMP-parallelized algorithms, users can explore interactive simulations that demonstrate the performance and structure of parallel computations.

[Backend repository](https://github.com/gonza224/matmul-ws-server)

## Demo
  The online demo can be found [here](https://matmul-playground.com/)

## Overview

- **Frontend:**  
  Built with [React](https://reactjs.org/) using [Vite](https://vitejs.dev/).  

- **Backend:**  
  Implemented in C++.  
  - [OpenMP](https://www.openmp.org/) for parallel computations.
  - [Simple-WebSocket-Server](https://gitlab.com/eidheim/Simple-WebSocket-Server) for real-time communication.  
  - [spdlog](https://github.com/gabime/spdlog) for logging.
  - [nlohmann/json](https://github.com/nlohmann/json) for JSON serialization/deserialization.

## Features

- **Interactive Visualization:** Students can observe how tasks are distributed among parallel threads.
- **Configurable Input Matrices:** Users can input their own matrices of any size from 1 to 50.
- **Step-by-Step Execution:** Pause and step through the multiplication process to understand the distribution of workload and accumulation of partial results.
- **Real-Time Feedback:** The frontend receives status updates from the backend server for each multiplication step via WebSockets.

## Prerequisites

- **General Requirements:**
  - [CMake](https://cmake.org/download/) for building the C++ project.
  - [Node.js](https://nodejs.org/) for the frontend.

- **Dependencies:**
  - **Backend:**
    - [OpenSSL](https://www.openssl.org/) (required by the WebSocket server).
    - [OpenMP](https://www.openmp.org/) (for parallel computations).
    - [Boost](https://www.boost.org/) (components: system, thread).
    - CMake will automatically fetch and build:
      - [spdlog v1.11.0](https://github.com/gabime/spdlog)
      - [nlohmann/json v3.11.3](https://github.com/nlohmann/json)
      - [Simple-WebSocket-Server](https://gitlab.com/eidheim/Simple-WebSocket-Server)
  
  - **Frontend:**
    - Dependencies handled by npm.

## Building and Running

### Backend (C++ WebSocket Server)

1. **Install Prerequisites:**

2. **Build the Backend:**
   ```bash
   cd backend
   mkdir build && cd build
   cmake ..
   make
   ```

3. **Run the Backend:**
   ```bash
   ./MatmulServer
   ```

### Frontend (React with Vite)

1. **Install Node.js Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the Frontend Development Server:**
   ```bash
   npm run dev
   ```

### Connecting Frontend and Backend

The frontend uses WebSockets to communicate with the backend server. In the frontend /.env file, ensure the 'WEBSOCKET_URL' matches the backend’s configured URL. For example, if the backend runs on `ws://localhost:9002/matmul/`:

```javascript
VITE_WEBSOCKET_URL="ws://localhost:9002/matmul/";
```

## Usage

1. **Start the Backend Server:** Ensure `MatmulServer` is running.
2. **Start the Frontend:** Access `http://localhost:5173` in a web browser.
3. **Start playing around!**

## Contributing

Contributions are welcome! Feel free to open issues, submit pull requests, or suggest improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/gonza224/matmul-playground/blob/main/LICENSE) file for details.
