import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';
import Heading from '@theme/Heading';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BenefitList = [
  {
    title: 'Master Real-World Robotics',
    imageUrl: 'img/benefits-ros.svg',
    description: (
      <>
        Go beyond theory. Learn to build, program, and deploy sophisticated humanoid robots using industry-standard tools like ROS 2, Gazebo, and the NVIDIA Isaac ecosystem.
      </>
    ),
  },
  {
    title: 'AI-Powered Simulation',
    imageUrl: 'img/benefits-sim.svg',
    description: (
      <>
        Leverage cutting-edge simulation environments like Isaac Sim and Unity to test and train your robots in complex, physically-accurate virtual worlds before deploying them in reality.
      </>
    ),
  },
  {
    title: 'Career-Defining Skills',
    imageUrl: 'img/benefits-career.svg',
    description: (
      <>
        The field of Physical AI is exploding. The skills you learn in this book—from robot kinematics to LLM-based control—will put you at the forefront of the next technological revolution.
      </>
    ),
  },
];

function Benefit({ title, imageUrl, description }) {
  return (
    <div className={styles.benefit}>
      <div className={styles.benefitImageContainer}>
        <img src={imageUrl} alt={title} className={styles.benefitImage} />
      </div>
      <Heading as="h3" className={styles.benefitTitle}>{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageBenefits() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    gsap.fromTo(
      el.querySelectorAll(`.${styles.benefit}`),
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%', // Animation starts when the top of the section is 80% down the viewport
        },
      }
    );
  }, []);

  return (
    <section className={styles.benefitsSection} ref={sectionRef}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Why This Book?</Heading>
        <div className={styles.benefitsGrid}>
          {BenefitList.map((props, idx) => (
            <Benefit key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
