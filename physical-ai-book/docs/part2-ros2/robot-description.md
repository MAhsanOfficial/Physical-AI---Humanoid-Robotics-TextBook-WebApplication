---
sidebar_position: 3
title: Robot Description
---

# Chapter 5 — Robot Description

To effectively simulate, control, and visualize robots, we need a standardized way to describe their physical characteristics, kinematics, and dynamics. This is where robot description formats come into play. In the ROS ecosystem, **URDF (Unified Robot Description Format)** and its macro language extension, **Xacro**, are the primary tools for defining robot models. This chapter will delve into these essential formats, explaining how to define a robot's links, joints, and inertial properties, and how to integrate sensors into these descriptions.

## 5.1 URDF (Unified Robot Description Format)

URDF is an XML-based file format used in ROS to describe all aspects of a robot model. It allows you to specify the robot's physical structure (links), how these links are connected (joints), and their visual and collision properties. URDF is an incredibly powerful tool because it provides a single, consistent model that can be used by various ROS tools for simulation (Gazebo), visualization (RViz), motion planning (MoveIt!), and more.

### Key Elements of URDF:

A URDF file is structured around two main elements: `<link>` and `<joint>`.

#### 5.1.1 Links

A `<link>` element describes a rigid body component of the robot. This could be a robot arm segment, a wheel, a sensor housing, or the robot's base. Each link has several properties:

*   **`<visual>`**: Describes the graphical properties of the link, defining how it appears in visualization tools like RViz.
    *   **`<geometry>`**: Specifies the shape (box, cylinder, sphere, or mesh from a CAD file like `.stl` or `.dae`).
    *   **`<material>`**: Defines the color and texture.
    *   **`<origin>`**: Specifies the pose (position and orientation) of the visual element relative to the link's origin.
*   **`<collision>`**: Describes the physical properties of the link for collision detection. This is often a simplified shape compared to the visual geometry to reduce computational load.
    *   **`<geometry>`**: Similar to visual geometry, but optimized for collision detection.
    *   **`<origin>`**: Pose relative to the link's origin.
*   **`<inertial>`**: Describes the physical properties of the link for dynamic simulation (e.g., in Gazebo).
    *   **`<mass>`**: The mass of the link in kilograms.
    *   **`<inertia>`**: A 3x3 inertia matrix (moments of inertia) around the link's center of mass.
    *   **`<origin>`**: The pose of the center of mass relative to the link's origin.

**Example Link Structure:**

```xml
<link name="base_link">
  <visual>
    <origin xyz="0 0 0.1" rpy="0 0 0"/>
    <geometry>
      <box size="0.6 0.4 0.2"/>
    </geometry>
    <material name="blue">
      <color rgba="0 0 0.8 1"/>
    </material>
  </visual>
  <collision>
    <origin xyz="0 0 0.1" rpy="0 0 0"/>
    <geometry>
      <box size="0.6 0.4 0.2"/>
    </geometry>
  </collision>
  <inertial>
    <origin xyz="0 0 0.1" rpy="0 0 0"/>
    <mass value="10.0"/>
    <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0"/>
  </inertial>
</link>
```

#### 5.1.2 Joints

A `<joint>` element connects two links, defining their kinematic relationship and any degrees of freedom. Each joint connects a `parent` link to a `child` link.

*   **`name`**: Unique identifier for the joint.
*   **`type`**: Defines the type of motion allowed by the joint.
    *   `revolute`: A single axis of rotation, with upper and lower limits.
    *   `continuous`: A single axis of rotation, with no limits.
    *   `prismatic`: A single axis of translation, with upper and lower limits.
    *   `fixed`: No motion between links (rigid connection).
    *   `planar`: Motion in a plane (x, y, and yaw).
    *   `floating`: All six degrees of freedom (x, y, z, roll, pitch, yaw).
*   **`<parent link="parent_link_name"/>`**: Specifies the parent link.
*   **`<child link="child_link_name"/>`**: Specifies the child link.
*   **`<origin>`**: Defines the pose of the child link frame relative to the parent link frame. This is where the joint rotates or translates.
*   **`<axis>`**: Specifies the axis of rotation or translation for revolute, continuous, and prismatic joints (e.g., `xyz="0 0 1"` for rotation around the Z-axis).
*   **`<limit>`**: For `revolute` and `prismatic` joints, defines the upper and lower limits of motion, as well as velocity and effort limits.

**Example Joint Structure:**

```xml
<joint name="base_to_arm_joint" type="revolute">
  <parent link="base_link"/>
  <child link="arm_link"/>
  <origin xyz="0 0 0.2" rpy="0 0 0"/>
  <axis xyz="0 0 1"/>
  <limit effort="30" velocity="1.0" lower="-1.57" upper="1.57"/>
</joint>
```

### 5.1.3 Robot Element

All `<link>` and `<joint>` elements are encapsulated within a single `<robot>` tag, which is the root element of the URDF file.

```xml
<?xml version="1.0"?>
<robot name="my_simple_robot">
  <!-- Define links -->
  <link name="base_link"> ... </link>
  <link name="arm_link"> ... </link>

  <!-- Define joints -->
  <joint name="base_to_arm_joint"> ... </joint>
</robot>
```

## 5.2 Xacro (XML Macros)

While URDF is powerful, it can become repetitive and difficult to manage for complex robots with many similar components (e.g., multiple fingers on a hand, or symmetrical legs). **Xacro (XML Macros)** is an XML macro language that extends URDF, allowing you to define reusable components, perform mathematical operations, and use conditional statements. This significantly reduces code duplication, improves readability, and makes URDF files more maintainable.

### Key Features of Xacro:

1.  **Macros**: Define reusable blocks of XML that can be instantiated multiple times with different parameters.
2.  **Properties**: Define variables that can be used throughout the Xacro file.
3.  **Mathematical Expressions**: Perform calculations directly within the XML using properties.
4.  **Conditional Statements**: Include or exclude parts of the URDF based on conditions.
5.  **Includes**: Modularize your robot description by including other Xacro files.

### Example Xacro Usage:

Suppose you want to define multiple identical links, but with different names and positions.

```xml
<?xml version="1.0"?>
<robot name="my_xacro_robot" xmlns:xacro="http://www.ros.org/wiki/xacro">

  <xacro:property name="arm_mass" value="0.5" />
  <xacro:property name="joint_limit" value="2.0" />

  <xacro:macro name="arm_segment" params="prefix parent_link_name child_link_name origin_xyz">
    <link name="${prefix}_${child_link_name}">
      <inertial>
        <mass value="${arm_mass}"/>
        <inertia ixx="0.01" ixy="0.0" ixz="0.0" iyy="0.01" iyz="0.0" izz="0.01"/>
      </inertial>
      <visual>
        <geometry><box size="0.1 0.1 0.5"/></geometry>
        <material name="green"/>
      </visual>
      <collision>
        <geometry><box size="0.1 0.1 0.5"/></geometry>
      </collision>
    </link>

    <joint name="${prefix}_${parent_link_name}_to_${child_link_name}_joint" type="revolute">
      <parent link="${parent_link_name}"/>
      <child link="${prefix}_${child_link_name}"/>
      <origin xyz="${origin_xyz}" rpy="0 0 0"/>
      <axis xyz="0 0 1"/>
      <limit effort="10" velocity="1.0" lower="-${joint_limit}" upper="${joint_limit}"/>
    </joint>
  </xacro:macro>

  <link name="base_link">
    <visual><geometry><box size="0.2 0.2 0.2"/></geometry><material name="red"/></visual>
    <inertial><mass value="1.0"/><inertia ixx="0.01" ixy="0.0" ixz="0.0" iyy="0.01" iyz="0.0" izz="0.01"/></inertial>
    <collision><geometry><box size="0.2 0.2 0.2"/></geometry></collision>
  </link>

  <xacro:arm_segment prefix="left" parent_link_name="base_link" child_link_name="upper_arm" origin_xyz="0 0 0.1"/>
  <xacro:arm_segment prefix="right" parent_link_name="base_link" child_link_name="upper_arm" origin_xyz="0 0 -0.1"/>

</robot>
```

To process a `.xacro` file into a `.urdf` file, you use the `xacro` command-line tool:
```bash
ros2 run xacro xacro my_xacro_robot.xacro > my_robot.urdf
```

## 5.3 Adding Sensors to URDF/Xacro

Sensors are integral to a robot's perception capabilities. In URDF/Xacro, sensors are typically represented as links and joints, similar to other robot components. However, to make them functional in simulation environments like Gazebo, additional elements are required, primarily `<sensor>` and `<plugin>` tags within the `<gazebo>` extension.

### Basic Sensor Representation:

A sensor is usually defined as a small link attached to a parent link via a fixed joint. This defines its position and orientation relative to the robot's body.

**Example: Simple Camera Link**

```xml
<link name="camera_link">
  <visual>
    <geometry><box size="0.02 0.05 0.05"/></geometry>
    <material name="black"/>
  </visual>
  <collision>
    <geometry><box size="0.02 0.05 0.05"/></geometry>
  </collision>
  <inertial>
    <mass value="0.1"/>
    <inertia ixx="0.0001" ixy="0.0" ixz="0.0" iyy="0.0001" iyz="0.0" izz="0.0001"/>
  </inertial>
</link>

<joint name="base_to_camera_joint" type="fixed">
  <parent link="base_link"/>
  <child link="camera_link"/>
  <origin xyz="0.1 0 0.2" rpy="0 0 0"/>
</joint>
```

### Gazebo Sensor Extensions:

For the camera to function in Gazebo and publish image data, you need to add Gazebo-specific extensions within your URDF/Xacro file. These extensions typically use `<gazebo>` tags that specify sensor types and plugin configurations.

```xml
<gazebo reference="camera_link">
  <sensor name="camera_sensor" type="camera">
    <pose>0 0 0 0 0 0</pose> <!-- Pose relative to camera_link -->
    <visualize>true</visualize>
    <update_rate>30.0</update_rate>
    <camera>
      <horizontal_fov>1.047</horizontal_fov>
      <image>
        <width>640</width>
        <height>480</height>
        <format>R8G8B8</format>
      </image>
      <clip>
        <near>0.05</near>
        <far>5</far>
      </clip>
    </camera>
    <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
      <ros>
        <namespace>camera</namespace>
        <argument>--ros-args --remap __tf:=tf</argument>
      </ros>
      <cameraName>camera_optical</cameraName>
      <frameName>camera_optical_frame</frameName>
      <hackBaseline>0.07</hackBaseline>
      <distortionK1>0.0</distortionK1>
      <distortionK2>0.0</distortionK2>
      <distortionK3>0.0</distortionK3>
      <distortionT1>0.0</distortionT1>
      <distortionT2>0.0</distortionT2>
      <Cx>320</Cx>
      <Cy>240</Cy>
      <fx>580</fx>
      <fy>580</fy>
    </plugin>
  </sensor>
</gazebo>
```
This Gazebo extension instructs the simulator to treat the `camera_link` as a camera sensor, defining its properties and a ROS 2 plugin (`libgazebo_ros_camera.so`) to publish image data to ROS topics. Similar extensions exist for LiDAR, IMUs, force sensors, etc.

## 5.4 Joints, Links, and Inertial Properties in Detail

A thorough understanding of how joints, links, and their inertial properties are defined is crucial for accurate simulation and control.

### Links: The Rigid Bodies

Links are the fundamental building blocks. They represent rigid segments of the robot. For accurate simulation, each link needs proper definition of:

*   **Mass**: The total mass of the link. Incorrect mass can lead to unrealistic dynamics.
*   **Center of Mass (CoM)**: The point at which the entire mass of the link can be considered concentrated. Its position (`origin` in `<inertial>`) relative to the link's geometric origin is critical. If not specified, it defaults to the link's geometric origin.
*   **Inertia Matrix**: A 3x3 matrix that describes how the mass is distributed around the CoM. It quantifies the link's resistance to angular acceleration. For simple geometries, analytical formulas can calculate inertia (e.g., for a box, sphere, cylinder). For complex shapes, CAD software can compute this. The inertia matrix is often given in the format:
    ```
    I = | ixx ixy ixz |
        | ixy iyy iyz |
        | ixz iyz izz |
    ```
    If your link is aligned with the principal axes, `ixy`, `ixz`, and `iyz` can be zero, simplifying the definition.

### Joints: The Connections

Joints define how links move relative to each other. Their accurate definition dictates the robot's kinematics.

*   **Origin**: This is the most critical parameter. The `<origin>` tag within a joint defines the coordinate frame of the *child link* relative to the coordinate frame of the *parent link*. This is where the joint's axis of motion is located. A common mistake is misplacing this origin, leading to incorrect kinematics.
*   **Axis**: For revolute, continuous, and prismatic joints, the `<axis>` tag specifies the vector about which the joint rotates or translates. It's defined relative to the *joint's own coordinate frame* (which is defined by the joint's origin).
*   **Limits**:
    *   **`lower` / `upper`**: The minimum and maximum positions (for revolute/prismatic) or angles (for revolute/continuous) the joint can reach. These are crucial for preventing self-collisions and defining the robot's workspace.
    *   **`velocity`**: The maximum angular or linear velocity of the joint.
    *   **`effort`**: The maximum force or torque the joint can exert. These limits are used by simulators and motion planners.

### Building a Kinematic Chain

By carefully defining links and joints, you construct a kinematic chain that accurately represents your robot's structure. The `parent` and `child` attributes in the `<joint>` tags form a tree-like structure, starting from a root link (often `base_link`) and branching out to the end-effectors.

Tools like RViz can load and display your URDF model, allowing you to visually inspect the link geometries, joint axes, and the overall kinematic structure. Simulators like Gazebo then use these descriptions to run dynamic simulations, applying physics rules to the defined masses, inertias, and joint constraints.

Understanding and correctly specifying these elements are foundational for any serious robotics development, enabling you to bring your robot designs to life in both visualization and simulation environments. This forms the basis for everything from motion planning to dynamic control and interaction with the physical world.