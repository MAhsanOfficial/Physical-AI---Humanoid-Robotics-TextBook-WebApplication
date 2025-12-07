---
sidebar_position: 4
title: RealSense Camera Setup
---

# Appendix D: Intel RealSense Camera Setup

Intel RealSense cameras are widely used in robotics for their ability to provide high-quality depth, RGB, and infrared data in a compact and affordable package. They are invaluable for tasks such as 3D mapping, object recognition, gesture tracking, and navigation. This appendix provides a step-by-step guide to setting up your Intel RealSense camera on an Ubuntu system, including installing the SDK and integrating it with ROS 2.

## 1. Supported RealSense Models

This guide is generally applicable to popular RealSense models like:

*   **D400 Series (e.g., D435, D455)**: Most common for robotics, offering robust depth sensing.
*   **L500 Series (e.g., L515)**: LiDAR-based depth camera, providing higher accuracy over distance.

## 2. Install librealsense SDK

The `librealsense` SDK is Intel's open-source cross-platform library for Intel RealSense depth cameras. It provides a simple API to access all camera streams (depth, color, infrared) and includes tools for configuration and firmware updates.

### 2.1 Add Intel's Repository

1.  Register the Intel server's public key:
    ```bash
    sudo mkdir -p /etc/apt/keyrings
    curl -sSf https://librealsense.intel.com/Debian/apt-repo/pool/Release.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/librealsense.gpg
    ```
2.  Add the Intel RealSense repository to your `sources.list.d`. Choose the correct distribution name for your Ubuntu version (e.g., `jammy` for 22.04, `focal` for 20.04).
    ```bash
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/librealsense.gpg] https://librealsense.intel.com/Debian/apt-repo $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/librealsense.list
    ```
3.  Update your package list:
    ```bash
    sudo apt update
    ```

### 2.2 Install the SDK

Install the core SDK and development packages:
```bash
sudo apt install librealsense2-dkms librealsense2-utils librealsense2-dev librealsense2-gl-dev librealsense2-net-dev
```
*   `librealsense2-dkms`: Ensures kernel modules are built for your kernel version.
*   `librealsense2-utils`: Provides command-line tools and examples (e.g., `realsense-viewer`).
*   `librealsense2-dev`: Development headers for compiling applications that use librealsense.

### 2.3 Verify Installation

1.  Connect your Intel RealSense camera to a USB 3.0 port on your computer.
2.  Launch the RealSense Viewer:
    ```bash
    realsense-viewer
    ```
    This graphical tool allows you to visualize all camera streams (depth, RGB, IR), configure settings, and update firmware. If it runs correctly and displays the camera feeds, your SDK installation is successful.

## 3. Install RealSense ROS Wrapper

To use your RealSense camera with ROS 2, you need the official `realsense-ros` wrapper. This package creates ROS 2 nodes that publish the camera's data to standard ROS 2 topics.

### 3.1 Create a ROS 2 Workspace (if you don't have one)

If you haven't already, create a ROS 2 workspace:
```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src
```

### 3.2 Clone the `realsense-ros` Repository

Clone the appropriate branch of the `realsense-ros` wrapper that matches your ROS 2 distribution (e.g., `humble` for ROS 2 Humble).

```bash
git clone https://github.com/IntelRealSense/realsense-ros.git -b ros2-development
# For Humble: git clone -b ros2-development https://github.com/IntelRealSense/realsense-ros.git
# Note: Check the official realsense-ros GitHub for the most up-to-date branch for your ROS 2 distro.
```

### 3.3 Install Dependencies

```bash
cd ~/ros2_ws
rosdep install --from-paths src --ignore-src -r -y
```

### 3.4 Build the Wrapper

```bash
colcon build --symlink-install
```

### 3.5 Source Your Workspace

```bash
source install/setup.bash
```
(Remember to add this to your `~/.bashrc` if you want it to be permanent).

## 4. Launching the RealSense Camera in ROS 2

Now you can launch the RealSense camera node and view its data in ROS 2.

```bash
ros2 launch realsense2_camera rs_launch.py
```

### 4.1 Verify Topics

Open a new terminal, source your workspace, and list the available ROS 2 topics:
```bash
ros2 topic list
```
You should see topics similar to:
*   `/camera/depth/image_rect_raw`
*   `/camera/color/image_raw`
*   `/camera/infra1/image_rect_raw`
*   `/camera/imu`
*   `/camera/depth/camera_info`
*   `/tf`
*   `/tf_static`

### 4.2 Visualize Data in RViz

To visualize the camera streams and 3D point cloud:

1.  Open RViz in a new terminal:
    ```bash
    rviz2
    ```
2.  In RViz, add the following displays:
    *   **Image**: For `/camera/color/image_raw` and `/camera/depth/image_rect_raw`.
    *   **PointCloud2**: For `/camera/depth/color/points` (if published, check `rs_launch.py` arguments for point cloud generation).
    *   **TF**: To see the camera's coordinate frames.
    *   Adjust the Fixed Frame to `camera_link` or `camera_depth_optical_frame` as appropriate.

## 5. Next Steps

Your Intel RealSense camera is now fully integrated with your ROS 2 environment. You can use its depth, color, and IMU data for:

*   **VSLAM**: As input for visual SLAM algorithms (see Chapter 9).
*   **Object Detection**: For identifying and localizing objects in 3D.
*   **Manipulation**: Guiding robot arms to pick up objects.
*   **Navigation**: Obstacle avoidance and mapping.

This camera provides essential perceptual input for developing sophisticated Physical AI behaviors.