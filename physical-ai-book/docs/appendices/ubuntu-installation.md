---
sidebar_position: 1
title: Ubuntu Installation
---

# Appendix A: Ubuntu Installation

Ubuntu is the recommended operating system for ROS 2 development due to its widespread adoption in the robotics community, extensive documentation, and robust package management. This appendix provides a step-by-step guide to installing Ubuntu, focusing on versions compatible with current ROS 2 distributions.

## 1. Choosing an Ubuntu Version

Always refer to the official ROS 2 documentation for compatible Ubuntu versions. As of this writing, common choices include:

*   **Ubuntu 20.04 LTS (Focal Fossa)**: Stable, widely used, compatible with ROS 2 Foxy Fitzroy and Galactic Geochelone.
*   **Ubuntu 22.04 LTS (Jammy Jellyfish)**: Newer LTS release, compatible with ROS 2 Humble Hawksbill and Iron Irwini.

**Recommendation**: For this course, **Ubuntu 22.04 LTS** is recommended as it supports the latest ROS 2 distributions and will receive long-term support.

## 2. Preparing for Installation

### 2.1 Download Ubuntu ISO Image

1.  Visit the official Ubuntu website: [ubuntu.com/download/desktop](https://ubuntu.com/download/desktop)
2.  Choose your desired LTS version (e.g., Ubuntu 22.04 LTS).
3.  Download the `.iso` file.

### 2.2 Create a Bootable USB Drive

You will need a USB drive (at least 8 GB) to create a bootable installer.

*   **On Windows**: Use tools like [Rufus](https://rufus.ie/) or [Etcher](https://www.balena.io/etcher/).
    1.  Insert your USB drive.
    2.  Open Rufus/Etcher, select the downloaded Ubuntu ISO, and choose your USB drive.
    3.  Follow the on-screen instructions to create the bootable drive.
*   **On macOS**: Use Etcher.
*   **On Linux**: Use Etcher, or the `dd` command:
    ```bash
    sudo dd if=/path/to/ubuntu.iso of=/dev/sdX status=progress bs=1M
    ```
    (Replace `/path/to/ubuntu.iso` with your downloaded ISO path and `/dev/sdX` with your USB drive, e.g., `/dev/sdb` - **BE EXTREMELY CAREFUL with `dd` as selecting the wrong device can erase your hard drive**).

### 2.3 Backup Important Data

Installing a new operating system, especially if dual-booting, always carries a small risk of data loss. **Backup all your important files** before proceeding.

### 2.4 Allocate Disk Space (for Dual Boot)

If you plan to dual-boot alongside Windows:

1.  **Shrink Windows Partition**:
    *   Right-click the Start button, select "Disk Management."
    *   Find your main Windows partition (usually `C:` drive), right-click it, and select "Shrink Volume."
    *   Enter the amount of space you want to allocate for Ubuntu (e.g., 100000 MB for 100 GB) and click "Shrink." This will create "Unallocated" space.
    *   **Do NOT format this unallocated space**. Ubuntu installer will use it.

### 2.5 Disable Secure Boot (if necessary)

Some systems, particularly newer ones, have Secure Boot enabled, which can interfere with Linux installations. You may need to disable it in your BIOS/UEFI settings. Consult your motherboard or PC manufacturer's documentation for specific instructions.

## 3. Ubuntu Installation Steps

1.  **Boot from USB**:
    *   Insert your bootable Ubuntu USB drive.
    *   Restart your computer.
    *   During startup, repeatedly press the key to enter your BIOS/UEFI settings or boot menu (commonly `F2`, `F10`, `F12`, `Del`, or `Esc`).
    *   Select your USB drive as the boot device.
2.  **Try or Install Ubuntu**:
    *   Once Ubuntu loads, you'll see a screen asking if you want to "Try Ubuntu" or "Install Ubuntu." Choose "Install Ubuntu."
3.  **Keyboard Layout**: Select your preferred keyboard layout.
4.  **Updates and Other Software**:
    *   **"Normal installation"**: Recommended.
    *   **"Download updates while installing Ubuntu"**: Recommended (requires internet connection).
    *   **"Install third-party software for graphics and Wi-Fi hardware and additional media formats"**: **Highly recommended** to ensure proper functioning of your hardware.
5.  **Installation Type**: This is the most crucial step, especially for dual-booting.
    *   **"Install Ubuntu alongside Windows Boot Manager"**: If you want to dual-boot and the installer detects Windows. This is usually the easiest option for dual-booting.
    *   **"Erase disk and install Ubuntu"**: **CAUTION! This will delete ALL data on your selected disk.** Only choose this if you want Ubuntu as your sole operating system.
    *   **"Something else"**: Allows for custom partitioning. Use this if you want to manually create partitions (e.g., separate `/boot`, `/`, `/home` partitions) or if you are installing on a specific drive. For the unallocated space you created earlier, you would select it, click `+` to create new partitions (e.g., a root partition `/` as Ext4, and a swap area).
6.  **Where are you?**: Select your geographical location for time zone settings.
7.  **Who are you?**: Enter your name, computer's name, username, and password. Choose a strong password.
8.  **Installation Progress**: The installation will proceed. This can take some time.
9.  **Restart**: Once the installation is complete, you will be prompted to restart your computer. Remove the USB drive when prompted.

## 4. Post-Installation Steps

After successfully installing Ubuntu:

1.  **Update Your System**: Open a terminal (Ctrl+Alt+T) and run:
    ```bash
    sudo apt update
    sudo apt upgrade -y
    sudo apt dist-upgrade -y
    sudo apt autoremove -y
    ```
    This ensures all your packages are up-to-date.
2.  **Install Essential Build Tools**:
    ```bash
    sudo apt install build-essential git cmake
    ```
    These are frequently needed for compiling software from source, including many ROS 2 packages.
3.  **Install `vim` or `nano` (if you prefer CLI editors)**:
    ```bash
    sudo apt install vim # or nano
    ```
4.  **Install `curl` and `wget`**:
    ```bash
    sudo apt install curl wget
    ```
    Useful for downloading files and setting up repositories.

You now have a fresh Ubuntu installation ready for ROS 2 development! Proceed to the next appendix for setting up your ROS 2 environment.