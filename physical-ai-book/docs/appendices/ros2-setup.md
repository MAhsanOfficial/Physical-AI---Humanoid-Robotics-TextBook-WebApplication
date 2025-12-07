---
sidebar_position: 2
title: ROS 2 Setup
---

# Appendix B: ROS 2 Setup

This appendix guides you through the process of installing ROS 2 on your Ubuntu system. We will focus on installing a binary distribution of ROS 2, which is the easiest and most recommended method for most users.

## 1. Choose Your ROS 2 Distribution

As of the last update, the recommended ROS 2 distribution for long-term support and stability is **Humble Hawksbill** (for Ubuntu 22.04) or **Iron Irwini** (for Ubuntu 22.04 with newer features). For this course, we will assume you are using **Ubuntu 22.04 and ROS 2 Humble Hawksbill**. If you are using a different Ubuntu version or prefer a different ROS 2 distribution, refer to the official ROS 2 documentation for specific instructions.

*   **ROS 2 Humble Hawksbill (LTS)**:
    *   Compatible with Ubuntu 22.04 (Jammy Jellyfish).
    *   Long-Term Support (LTS) means it will be maintained for several years.

## 2. Setup Your Environment

Before installing ROS 2, ensure your Ubuntu system is up-to-date and correctly configured for ROS 2 repositories.

### 2.1 Update System Packages

Open a terminal and run:
```bash
sudo apt update
sudo apt upgrade -y
```

### 2.2 Install Curl and Software Properties Common

If not already installed:
```bash
sudo apt install -y curl software-properties-common
```

### 2.3 Add ROS 2 GPG Key

ROS 2 packages are signed with a GPG key for security. You need to add this key to your system:
```bash
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
```

### 2.4 Add ROS 2 Repository to Your Sources List

Next, add the ROS 2 repository to your system's `sources.list`. Use the correct distribution name (`jammy` for Ubuntu 22.04) and ROS 2 release (`humble`):
```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

## 3. Install ROS 2 Packages

With the repository added, you can now install ROS 2. We recommend installing the "Desktop Full" version, which includes ROS, RViz, demos, and tutorials.

### 3.1 Install ROS 2 Humble Desktop Full

```bash
sudo apt update
sudo apt install -y ros-humble-desktop-full
```
This command will download and install a significant number of packages. It might take some time depending on your internet connection.

### 3.2 Install ROS 2 Development Tools

You will also need development tools like `colcon` (the ROS 2 build system) and `rosdep` (for installing system dependencies).

```bash
sudo apt install -y python3-colcon-common-extensions python3-rosdep
```

## 4. Environment Setup

After installation, you need to "source" the ROS 2 setup files in each new terminal session to make ROS 2 commands available.

### 4.1 Source the Setup Script

```bash
source /opt/ros/humble/setup.bash
```

### 4.2 Automatically Source at Login (Optional, but Recommended)

To avoid typing the `source` command every time you open a new terminal, you can add it to your `~/.bashrc` file.

```bash
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

## 5. Verify Your Installation

You can verify that ROS 2 is installed correctly by running a few test commands.

### 5.1 Check ROS 2 Version

```bash
ros2 --version
```
This should output the installed ROS 2 version (e.g., `ros2cli 0.11.x`, `ros2core 0.11.x`, `rclpy 3.x.x`).

### 5.2 Run the Talker-Listener Demo

ROS 2 comes with a simple "talker-listener" demo that demonstrates basic topic communication.

1.  Open one terminal and run the talker:
    ```bash
    source /opt/ros/humble/setup.bash
    ros2 run demo_nodes_cpp talker
    ```
2.  Open a second terminal and run the listener:
    ```bash
    source /opt/ros/humble/setup.bash
    ros2 run demo_nodes_py listener
    ```
You should see messages being exchanged between the two terminals. If you are unable to source the environment or run these nodes, review the installation steps carefully.

## 6. Initialize `rosdep`

`rosdep` is a command-line tool for installing system dependencies of ROS packages. It's crucial for building ROS 2 workspaces from source.

```bash
sudo rosdep init
rosdep update
```

## 7. Next Steps

Your ROS 2 environment is now ready! You can proceed to create your own ROS 2 packages and start developing robotic applications. Remember to always source your ROS 2 environment in each new terminal or configure your `~/.bashrc` to do so automatically.

For further development, consider setting up a ROS 2 workspace, as demonstrated in Chapter 4: ROS 2 Development in Python.