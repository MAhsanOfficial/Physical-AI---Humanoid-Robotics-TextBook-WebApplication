---
sidebar_position: 2
title: ROS 2 Development in Python
---

# Chapter 4 — ROS 2 Development in Python

Python is a high-level, interpreted programming language widely adopted in robotics due to its simplicity, extensive libraries, and rapid prototyping capabilities. ROS 2 provides `rclpy`, its Python client library, enabling developers to easily create and manage ROS 2 nodes, publish and subscribe to topics, offer and call services, and interact with actions. This chapter delves into practical ROS 2 development using Python, guiding you through the creation of essential robotic functionalities.

## 4.1 rclpy: The Python Client Library

`rclpy` is the official Python client library for ROS 2. It wraps the underlying C API (`rcl`) and provides a Pythonic interface for interacting with the ROS 2 graph. Using `rclpy`, you can write ROS 2 applications entirely in Python, leveraging its strengths for data processing, AI algorithms, and high-level control logic.

### Key features of `rclpy`:

*   **Node Creation**: Instantiate ROS 2 nodes to encapsulate computation.
*   **Publisher/Subscriber**: Create publishers to send messages and subscribers to receive messages on topics.
*   **Service Server/Client**: Implement services for request-reply communication patterns.
*   **Action Server/Client**: Develop actions for long-running, goal-oriented tasks with feedback.
*   **Parameter Management**: Access and modify node parameters at runtime.
*   **Executors**: Manage the execution of multiple callbacks (from subscriptions, service requests, etc.) concurrently.

### Basic Structure of a `rclpy` Node:

Every `rclpy` node typically follows a similar structure:

1.  **Import `rclpy` and message/service types.**
2.  **Initialize `rclpy`**.
3.  **Create a Node instance**.
4.  **Create publishers, subscribers, service servers, clients, etc.**
5.  **Spin the node**: `rclpy.spin()` or `executor.spin()` to allow the node to process callbacks.
6.  **Shutdown `rclpy`**.

Let's illustrate with practical examples.

## 4.2 Writing Control Nodes

Control nodes are fundamental in robotics, responsible for generating commands to move actuators (e.g., motor speeds, joint positions) based on high-level instructions or sensor feedback. Here, we'll demonstrate how to create a simple control node that publishes velocity commands.

### Example: Differential Drive Robot Controller

Consider a differential drive robot where we want to control its linear and angular velocity. We'll use the `geometry_msgs/msg/Twist` message type, which contains `linear.x` (forward/backward velocity) and `angular.z` (turning velocity).

First, ensure you have the necessary ROS 2 message types installed:
```bash
sudo apt update
sudo apt install ros-<ROS_DISTRO>-geometry-msgs
```
Replace `<ROS_DISTRO>` with your ROS 2 distribution (e.g., `humble`, `iron`).

Now, create a Python file, e.g., `minimal_publisher.py`:

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist # Import the Twist message type

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(Twist, 'cmd_vel', 10) # Create a publisher for Twist messages on 'cmd_vel' topic with queue size 10
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = Twist()
        msg.linear.x = 0.5 # Move forward at 0.5 m/s
        msg.angular.z = 0.2 # Turn at 0.2 rad/s
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: Linear.x="{msg.linear.x}", Angular.z="{msg.angular.z}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args) # Initialize rclpy

    minimal_publisher = MinimalPublisher() # Create the node

    rclpy.spin(minimal_publisher) # Keep the node alive, processing callbacks

    # Destroy the node explicitly
    # and shutdown the rclpy library
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

To run this node:
1.  Save the file as `minimal_publisher.py` in your ROS 2 workspace (e.g., `~/ros2_ws/src/my_robot_pkg/my_robot_pkg/`).
2.  Make sure your `my_robot_pkg` has an `__init__.py` file in `my_robot_pkg/my_robot_pkg/`.
3.  Add an entry point in your `setup.py` (located at `~/ros2_ws/src/my_robot_pkg/setup.py`):
    ```python
    from setuptools import find_packages, setup

    package_name = 'my_robot_pkg'

    setup(
        name=package_name,
        version='0.0.0',
        packages=find_packages(exclude=['test']),
        data_files=[
            ('share/' + package_name, ['package.xml']),
            ('share/' + package_name + '/launch', ['launch/my_launch_file.launch.py']), # Example launch file
        ],
        install_requires=['setuptools'],
        zip_safe=True,
        maintainer='your_name',
        maintainer_email='your_email@example.com',
        description='TODO: Package description',
        license='TODO: License declaration',
        tests_require=['pytest'],
        entry_points={
            'console_scripts': [
                'minimal_publisher = my_robot_pkg.minimal_publisher:main',
            ],
        },
    )
    ```
4.  Build your workspace: `cd ~/ros2_ws && colcon build`
5.  Source the setup files: `source install/setup.bash`
6.  Run the node: `ros2 run my_robot_pkg minimal_publisher`

You can verify the messages being published using `ros2 topic echo /cmd_vel` in another terminal.

### Writing a Subscriber Node

A subscriber node listens to messages published on a topic. Let's create a node that subscribes to the `cmd_vel` topic and prints the received velocity commands.

Create a Python file, e.g., `minimal_subscriber.py`:

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class MinimalSubscriber(Node):
    def __init__(self):
        super().__init__('minimal_subscriber')
        # Create a subscriber for Twist messages on 'cmd_vel' topic with queue size 10
        self.subscription = self.create_subscription(
            Twist,
            'cmd_vel',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info(f'I heard: Linear.x="{msg.linear.x}", Angular.z="{msg.angular.z}"')

def main(args=None):
    rclpy.init(args=args)

    minimal_subscriber = MinimalSubscriber()

    rclpy.spin(minimal_subscriber)

    # Destroy the node explicitly
    minimal_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

Add an entry point for `minimal_subscriber` in your `setup.py` similar to `minimal_publisher`. Build and run it.

## 4.3 Publishing Sensor Data

Publishing sensor data is a critical function for any robot. This involves reading data from a sensor (simulated or real) and publishing it to a ROS 2 topic in the appropriate message format.

### Example: Publishing a Simulated IMU Reading

Let's simulate an IMU (Inertial Measurement Unit) and publish its data using `sensor_msgs/msg/Imu` messages. An IMU typically provides angular velocity, linear acceleration, and orientation (quaternion).

First, ensure you have the necessary message types:
```bash
sudo apt install ros-<ROS_DISTRO>-sensor-msgs
```

Create a Python file, e.g., `imu_publisher.py`:

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu
from geometry_msgs.msg import Quaternion
import math
import random

class ImuPublisher(Node):
    def __init__(self):
        super().__init__('imu_publisher')
        self.publisher_ = self.create_publisher(Imu, 'imu_data', 10)
        self.timer = self.create_timer(0.1, self.publish_imu_data) # Publish every 0.1 seconds
        self.get_logger().info('IMU Publisher node started.')

    def publish_imu_data(self):
        imu_msg = Imu()
        imu_msg.header.stamp = self.get_clock().now().to_msg()
        imu_msg.header.frame_id = 'imu_link' # Important: Define the frame_id of the IMU

        # Simulate angular velocity (e.g., small random fluctuations)
        imu_msg.angular_velocity.x = random.uniform(-0.01, 0.01)
        imu_msg.angular_velocity.y = random.uniform(-0.01, 0.01)
        imu_msg.angular_velocity.z = random.uniform(-0.01, 0.01)

        # Simulate linear acceleration (e.g., primarily gravity, plus small noise)
        imu_msg.linear_acceleration.x = random.uniform(-0.01, 0.01)
        imu_msg.linear_acceleration.y = random.uniform(-0.01, 0.01)
        imu_msg.linear_acceleration.z = 9.81 + random.uniform(-0.05, 0.05) # Gravity + noise

        # Simulate orientation (e.g., a static orientation for simplicity, or slowly changing)
        # For a static robot, orientation should be constant. Here's an identity quaternion.
        # w=1, x=0, y=0, z=0 represents no rotation.
        imu_msg.orientation.w = 1.0
        imu_msg.orientation.x = 0.0
        imu_msg.orientation.y = 0.0
        imu_msg.orientation.z = 0.0

        # Set covariance matrices (optional, but good practice for real sensors)
        # If the sensor does not provide covariance, you can set to 0 or -1 (unknown)
        imu_msg.orientation_covariance[0] = 0.01 # Example covariance
        imu_msg.angular_velocity_covariance[0] = 0.01
        imu_msg.linear_acceleration_covariance[0] = 0.01

        self.publisher_.publish(imu_msg)
        self.get_logger().info('Publishing IMU data...')

def main(args=None):
    rclpy.init(args=args)
    imu_publisher = ImuPublisher()
    rclpy.spin(imu_publisher)
    imu_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

Add an entry point for `imu_publisher` in your `setup.py`. Build and run it, then use `ros2 topic echo /imu_data` to see the published messages.

### Key Considerations for Sensor Data Publishing:

*   **Message Types**: Always use the most appropriate ROS 2 message type for your sensor data (`sensor_msgs/msg/Image`, `sensor_msgs/msg/LaserScan`, `sensor_msgs/msg/PointCloud2`, etc.).
*   **`frame_id`**: Set the `header.frame_id` correctly to identify the coordinate frame from which the sensor data originates. This is crucial for TF (Transformations) in ROS 2.
*   **`stamp`**: Populate `header.stamp` with the timestamp when the data was acquired. Accurate timestamps are vital for synchronization and data fusion.
*   **Frequency**: Publish data at a consistent and appropriate frequency for the sensor and its application.
*   **Covariance**: If your sensor provides covariance information (a measure of uncertainty), include it in the message. This is used by filtering algorithms like Kalman filters for more accurate state estimation.

By mastering these basic patterns for publishing and subscribing data, you lay the groundwork for building complex robotic behaviors and integrating various hardware components into a cohesive ROS 2 system. The ability to write control nodes and effectively manage sensor data is fundamental to creating truly intelligent Physical AI agents.