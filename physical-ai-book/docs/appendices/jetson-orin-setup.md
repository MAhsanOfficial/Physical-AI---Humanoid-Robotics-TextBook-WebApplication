---
sidebar_position: 3
title: Jetson Orin Setup
---

# Appendix C: Jetson Orin Setup

NVIDIA Jetson Orin platforms are powerful System-on-Modules (SOMs) designed for AI at the edge, making them ideal for deploying advanced Physical AI applications on compact and power-efficient robotic hardware. This appendix provides a guide to setting up your Jetson Orin developer kit for robotics development, focusing on flashing the operating system and installing necessary libraries.

## 1. Jetson Orin Developer Kits

NVIDIA offers several Jetson Orin developer kits, including:

*   **Jetson Orin Nano Developer Kit**: Entry-level, cost-effective for smaller projects.
*   **Jetson Orin NX Developer Kit**: More powerful, balancing performance and size.
*   **Jetson AGX Orin Developer Kit**: High-end, offering maximum AI performance for complex applications.

The setup process is largely similar across these kits.

## 2. Flashing the Jetson OS (JetPack SDK)

The Jetson operating system, based on Ubuntu Linux, is installed using the **NVIDIA JetPack SDK**. JetPack includes the OS image, CUDA Toolkit, cuDNN, TensorRT, OpenCV, and other NVIDIA libraries essential for AI development.

### 2.1 Prerequisites

*   **Host PC**: An Ubuntu 18.04/20.04/22.04 LTS (x86_64) machine. This PC will run the NVIDIA SDK Manager.
*   **Internet Connection**: Required for downloading JetPack components.
*   **USB-C Cable**: For connecting the Jetson Developer Kit to the host PC.
*   **Power Supply**: For the Jetson Developer Kit.
*   **Monitor, Keyboard, Mouse**: For initial setup of the Jetson.

### 2.2 Install NVIDIA SDK Manager on Host PC

1.  Download the SDK Manager from the NVIDIA Developer website: [developer.nvidia.com/sdk-manager](https://developer.nvidia.com/sdk-manager)
2.  Install it on your Ubuntu host PC:
    ```bash
    sudo apt install ./sdkmanager_<version>.deb
    ```
    (Replace `<version>` with the downloaded SDK Manager version).

### 2.3 Flash Jetson OS using SDK Manager

1.  **Launch SDK Manager**: Open SDK Manager on your host PC. You'll need to log in with your NVIDIA Developer account.
2.  **Select Hardware Configuration**: On the "STEP 1: Development Environment" screen, select your Jetson Developer Kit. Choose "Host Machine" as "Ubuntu" and "Target Hardware" as your specific Jetson Orin Developer Kit.
3.  **Select Components**:
    *   Under "Jetson OS", ensure "Jetson OS" and "Bootloader" are selected.
    *   Under "Jetson SDK Components", you can select specific libraries you need (e.g., CUDA, cuDNN, TensorRT, VisionWorks, OpenCV). For a full development environment, select all.
    *   Choose the "Download now. Install later." or "Download and Install." option.
4.  **Put Jetson into Recovery Mode**: This is crucial.
    *   **Ensure Jetson is OFF**.
    *   Connect the USB-C cable from the **Host PC** to the **Jetson's USB-C recovery port** (usually the one nearest the power input).
    *   **Power ON** the Jetson.
    *   Press and hold the **Recovery button**, then press and release the **Reset button**, then release the Recovery button after 2 seconds. The Jetson should now be in recovery mode (no display output).
5.  **Flash and Install**:
    *   In SDK Manager, click "Continue" to "STEP 2: Details and License." Agree to the terms.
    *   Click "Continue" to "STEP 3: Flash OS." SDK Manager will detect your Jetson in recovery mode.
    *   Select "Manual Setup" or "Automatic Setup" (Automatic is easier if it works). If using "Manual Setup", you might need to specify the IP address of the Jetson if not automatically detected.
    *   Click "Flash" to start the flashing process. This will install the OS onto your Jetson's eMMC or SD card.
    *   Once the OS is flashed, SDK Manager will prompt you to install the SDK components. Connect a display, keyboard, and mouse to the Jetson, and complete the initial setup (language, timezone, create user account).
    *   After the initial setup, the Jetson will boot into its desktop. Connect it to the internet.
    *   In SDK Manager on the host PC, continue the installation of SDK components. It will install them over the network (SSH) to your Jetson.

## 3. Basic Jetson Orin Configuration

After successful flashing and component installation:

### 3.1 Update and Upgrade

On your Jetson Orin, open a terminal and update packages:
```bash
sudo apt update
sudo apt upgrade -y
```

### 3.2 Maximize Performance (Optional, but Recommended)

Jetson Orin devices can operate in different power modes. For maximum performance in development, set it to MAXN mode:
```bash
sudo nvpmodel -m 0
sudo jetson_clocks --show # Shows current clock frequencies
sudo jetson_clocks # Enables max clock frequencies
```

### 3.3 Install `htop` (Useful for Monitoring)

```bash
sudo apt install htop
```
Use `htop` to monitor CPU, RAM, and GPU usage (`sudo apt install tegrastats` for more detailed GPU stats, or `jtop` from `pip`).

## 4. Setting up ROS 2 on Jetson Orin

Once the Jetson OS is installed, setting up ROS 2 on it is similar to setting it up on a regular Ubuntu desktop, but with a few nuances for optimal performance.

1.  **Follow Appendix B: ROS 2 Setup**: Install ROS 2 Humble (or your chosen distribution) using the binary installation method. Ensure you use the ARM64 architecture packages.
2.  **Verify Performance**: After installing ROS 2 and any compute-intensive packages, verify that nodes are leveraging the GPU. For example, Isaac ROS packages are specifically designed to run on NVIDIA GPUs.

## 5. Next Steps

Your Jetson Orin is now configured for advanced Physical AI and robotics development. You can now:

*   Deploy your ROS 2 applications.
*   Integrate NVIDIA Isaac ROS modules for accelerated perception (see Chapter 9).
*   Run complex AI models using TensorRT and CUDA.

The Jetson Orin provides the computational muscle to bring your humanoid robots to life, bridging the gap between simulation and real-world deployment.