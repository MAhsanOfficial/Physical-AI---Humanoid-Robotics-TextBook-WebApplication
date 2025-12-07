---
sidebar_position: 1
title: ROS 2 Fundamentals
---

# Chapter 3 — ROS 2 Fundamentals

The Robot Operating System (ROS) has become the de facto standard for robotics software development, providing a flexible framework for writing robot software. ROS 2, the successor to the original ROS, brings significant improvements in terms of real-time capabilities, security, and multi-robot support, making it an indispensable tool for building advanced Physical AI and humanoid robotics systems. This chapter dives into the fundamental concepts of ROS 2, exploring its architecture, the Data Distribution Service (DDS) that underpins its communication, and the core communication primitives: Nodes, Topics, and Services.

## 3.1 Architecture

ROS 2's architecture is a departure from its predecessor, designed to address the demands of modern robotics applications such, as those required for humanoid systems operating in complex, safety-critical environments. Its primary design goals include:

*   **Real-time Capabilities**: Supporting applications where timing is critical, such as robot control loops.
*   **Quality of Service (QoS)**: Allowing developers to specify reliability, durability, and other communication parameters.
*   **Multi-robot Systems**: Facilitating communication and coordination among multiple robots.
*   **Security**: Incorporating robust security features to protect against unauthorized access and manipulation.
*   **Embedded Systems**: Better support for resource-constrained hardware.

The core of ROS 2's architecture is its **decentralized, peer-to-peer communication model**, built upon the **Data Distribution Service (DDS)**. Unlike ROS 1's centralized master, ROS 2 nodes can discover and communicate directly with each other without a single point of failure.

### Key Architectural Components:

1.  **Nodes**: These are individual processes that perform computation. Each node is responsible for a single, modular function (e.g., a camera driver, a motor controller, a navigation algorithm). This modularity promotes code reusability and simplifies development.
2.  **Topics**: A publish/subscribe communication mechanism. Nodes publish messages to topics, and other nodes subscribe to those topics to receive messages. This is ideal for streaming data like sensor readings or command velocities.
3.  **Services**: A request/reply communication mechanism. A client node sends a request message to a service server, which processes the request and sends back a response. This is suitable for operations that involve a clear request and a single response, like triggering a robot arm to pick up an object.
4.  **Actions**: A long-running goal/feedback/result communication mechanism. Actions are used for tasks that take a significant amount of time to complete and require periodic feedback. A client sends a goal, the action server provides continuous feedback on progress, and eventually a final result. Examples include navigating to a specific location or performing a complex manipulation sequence.
5.  **Parameters**: Dynamic configuration values that can be changed at runtime. Nodes can expose parameters to allow users or other nodes to adjust their behavior without recompiling the code.
6.  **ROS 2 Graph**: The collection of all ROS 2 executable entities (nodes, topics, services, actions, parameters) and the connections between them. This graph is dynamic and can change as nodes start, stop, or communicate.

### Communication Flow:

In ROS 2, when a node wants to communicate, it doesn't need to know the specific name or location of the other nodes. Instead, it interacts with the DDS middleware:

*   A publisher node announces its intention to publish messages on a specific topic.
*   A subscriber node announces its intention to subscribe to a specific topic.
*   The DDS middleware handles the discovery of matching publishers and subscribers and establishes direct peer-to-peer connections between them.
*   This decentralized approach enhances scalability, robustness, and fault tolerance, critical for complex robotic systems.

## 3.2 DDS (Data Distribution Service)

At the heart of ROS 2's communication infrastructure lies the **Data Distribution Service (DDS)**. DDS is an open international standard (maintained by the Object Management Group - OMG) for real-time, scalable, and high-performance data exchange. It is specifically designed for distributed systems where low-latency, high-throughput, and deterministic communication are paramount—qualities essential for robotics.

### Key Features of DDS:

1.  **Discovery**: DDS automatically discovers applications (nodes in ROS 2) that are publishing or subscribing to the same data (topics). This eliminates the need for a centralized broker or master.
2.  **Quality of Service (QoS) Policies**: DDS provides a rich set of QoS policies that allow developers to fine-tune communication characteristics. These policies are crucial for meeting the diverse requirements of different robotic components. Common QoS policies include:
    *   **Reliability**: Guarantees message delivery (or best effort).
    *   **Durability**: Specifies whether messages are kept for late-joining subscribers.
    *   **Liveliness**: Monitors whether a node is still active.
    *   **History**: Determines how many messages are buffered for new subscribers.
    *   **Deadline**: Sets a minimum period between messages from a publisher.
    *   **Latency Budget**: Specifies the maximum acceptable delay between publication and reception.
    *   **Lease Duration**: Defines how long a publisher or subscriber remains active without activity.
    These policies enable developers to specify the exact communication behavior required for each interaction, balancing trade-offs between latency, reliability, and resource usage. For instance, a robot's motor commands might require strict reliability and low latency, while debugging logs might use best-effort delivery.
3.  **Type-Safety**: DDS ensures that publishers and subscribers agree on the data type being exchanged, preventing communication errors due to type mismatches.
4.  **Platform Independence**: DDS implementations are available across various operating systems and programming languages, allowing for heterogeneous systems.
5.  **Decentralized**: No single point of failure, enhancing system robustness.

### How DDS works in ROS 2:

ROS 2 uses DDS as its "middleware layer." When you create a ROS 2 node that publishes to a topic or subscribes from one, the ROS 2 client library (e.g., `rclcpp` for C++, `rclpy` for Python) translates these operations into DDS-specific calls. The underlying DDS implementation then handles the actual data distribution across the network.

Several DDS implementations are available, and ROS 2 supports multiple "RMW (ROS Middleware) implementations" that can interface with different DDS vendors (e.g., Fast DDS, RTI Connext, Cyclone DDS). This modularity allows users to choose the DDS vendor that best fits their specific performance, licensing, or certification requirements.

## 3.3 Nodes, Topics, Services

These are the fundamental communication primitives in ROS 2, forming the building blocks of any robotic application. Understanding how they work is crucial for effective ROS 2 development.

### 3.3.1 Nodes

As mentioned, a node is an executable process that performs computation. In a typical ROS 2 system, many nodes work collaboratively to achieve a complex task.

*   **Modularity**: Each node should ideally be responsible for a single, well-defined function. For example, one node might be a camera driver, another an object detection algorithm, and a third a motor controller.
*   **Isolation**: Nodes run as separate processes, meaning a crash in one node typically does not bring down the entire robot system (though dependent nodes might cease to function correctly).
*   **Examples**:
    *   `/camera_publisher_node`: Reads images from a camera and publishes them.
    *   `/object_detector_node`: Subscribes to image topics, processes them, and publishes detected object bounding boxes.
    *   `/cmd_vel_controller_node`: Subscribes to velocity commands and sends appropriate signals to motor drivers.

### 3.3.2 Topics (Publish/Subscribe)

Topics are the primary mechanism for asynchronous, many-to-many, streaming communication in ROS 2. Data is continuously published to a topic, and any node interested in that data can subscribe to it.

*   **Publisher**: A node that sends messages to a topic. It doesn't need to know which (if any) nodes are subscribed.
*   **Subscriber**: A node that receives messages from a topic. It doesn't need to know which (if any) nodes are publishing.
*   **Messages**: Data structures exchanged over topics. These are strongly typed and defined using a `.msg` file, which then generates code for various programming languages. Examples include `std_msgs/msg/String`, `sensor_msgs/msg/Image`, `geometry_msgs/msg/Twist`.
*   **Decentralized**: The DDS middleware handles the routing of messages directly between publishers and subscribers without a central server.
*   **Analogy**: Think of topics like radio channels. A radio station (publisher) broadcasts music on a specific frequency (topic). Anyone with a radio (subscriber) tuned to that frequency can listen. The radio station doesn't know or care how many listeners there are.

#### Example Use Cases:
*   Publishing sensor data (camera images, LiDAR scans, IMU readings).
*   Publishing robot odometry (position and orientation).
*   Publishing desired velocity commands to the robot base.
*   Publishing status updates (battery level, error codes).

### 3.3.3 Services (Request/Reply)

Services provide a synchronous, one-to-one, request/reply communication mechanism. They are used for operations where a client node needs to request a specific computation or action from a server node and expects an immediate response.

*   **Service Server**: A node that offers a service. It waits for incoming requests, processes them, and sends back a response.
*   **Service Client**: A node that sends a request to a service server and waits for a response.
*   **Service Definition**: Defined using a `.srv` file, which specifies both the request and response message types.
*   **Synchronous**: The client typically blocks until it receives a response or a timeout occurs.
*   **Analogy**: Think of services like making a phone call to a specific department for a particular query. You make a request (ask a question), wait for an answer, and then receive a response.

#### Example Use Cases:
*   Triggering a specific action (e.g., "calibrate IMU", "reset odometry").
*   Querying information (e.g., "get current robot pose", "lookup object properties").
*   Performing complex computations that return a single result (e.g., "calculate inverse kinematics for a target pose").

### 3.3.4 Actions (Goal/Feedback/Result)

Actions are designed for long-running, interruptible tasks that provide regular feedback about their progress. They combine aspects of topics (for feedback) and services (for a defined goal and result).

*   **Action Server**: Receives goals, executes the task, provides periodic feedback, and sends a final result. It can also be preempted (cancelled) by a client.
*   **Action Client**: Sends a goal to an action server, can receive continuous feedback, and eventually gets a result. It can also send preemption requests.
*   **Action Definition**: Defined using a `.action` file, specifying the goal, feedback, and result message types.
*   **Asynchronous with Feedback**: The client does not block while the action is running; it can receive feedback messages asynchronously.
*   **Analogy**: Think of ordering a complex pizza for delivery. You send your order (goal), get updates on its status (feedback: "preparing," "baking," "out for delivery"), and eventually receive the pizza (result). You can also call to cancel the order (preemption).

#### Example Use Cases:
*   Robot navigation to a distant goal (feedback on current position, remaining distance).
*   Complex manipulation sequences (feedback on current manipulation step, joint states).
*   Executing a long-duration calibration routine.

By mastering these fundamental communication primitives and understanding the underlying DDS architecture, you will be well-equipped to design, implement, and debug sophisticated robotics applications using ROS 2, paving the way for advanced Physical AI systems.