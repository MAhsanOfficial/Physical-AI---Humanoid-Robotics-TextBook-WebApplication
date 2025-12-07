---
sidebar_position: 4
title: Hardware Requirements
---

# Hardware Requirements

While this textbook emphasizes simulation and software-based learning, certain hardware capabilities will significantly enhance your experience and allow you to explore more advanced topics, especially in the context of NVIDIA Isaac Sim and complex Gazebo simulations.

## Minimum Recommended Hardware

For a smooth learning experience, particularly when running ROS 2 examples and basic Gazebo simulations, we recommend the following:

*   **Processor (CPU)**: A modern multi-core processor (e.g., Intel Core i5/i7 10th generation or newer, AMD Ryzen 5/7 3000 series or newer).
*   **Memory (RAM)**: 16 GB RAM. 32 GB is highly recommended for running multiple simulations or complex development environments concurrently.
*   **Storage**: 500 GB SSD (Solid State Drive). This is crucial for fast loading times of operating systems, development tools, and large simulation assets.
*   **Graphics Card (GPU)**: A dedicated GPU with at least 4 GB VRAM (e.g., NVIDIA GeForce GTX 1650 or AMD Radeon RX 570). This will be sufficient for basic 3D visualization in Gazebo and Unity.

## Recommended Hardware for Advanced Simulations (NVIDIA Isaac Sim)

To fully leverage the power of NVIDIA Isaac Sim, including real-time ray tracing, advanced physics, and domain randomization, a more powerful NVIDIA GPU is essential.

*   **Processor (CPU)**: Intel Core i7/i9 (11th generation or newer) or AMD Ryzen 7/9 (5000 series or newer).
*   **Memory (RAM)**: 32 GB RAM. 64 GB is ideal for professional-level simulation and development.
*   **Storage**: 1 TB NVMe SSD.
*   **Graphics Card (GPU)**: NVIDIA RTX series GPU with at least 8 GB VRAM (e.g., NVIDIA GeForce RTX 3060/4060 or newer). For the best experience, an RTX 3080/4080 or better is recommended. Isaac Sim heavily relies on CUDA cores and RT Cores for its performance.

## Operating System

This course primarily uses **Ubuntu 20.04 LTS (Focal Fossa)** or **Ubuntu 22.04 LTS (Jammy Jellyfish)** as the development environment, especially for ROS 2. Virtual machines (VMs) are acceptable for basic tasks, but direct installation or a dual-boot setup is recommended for optimal performance, particularly for GPU-intensive applications.

## Cloud Computing Alternatives

If you do not have access to the recommended hardware, consider utilizing cloud computing services that offer GPU-accelerated instances (e.g., AWS EC2, Google Cloud Platform, Azure). This can be a cost-effective way to access high-end hardware for specific tasks, though managing cloud instances requires its own set of skills.

---

*Note*: The "Hardware Buying Guide" in the Appendices provides more detailed recommendations and considerations for purchasing hardware suitable for Physical AI and Humanoid Robotics development.