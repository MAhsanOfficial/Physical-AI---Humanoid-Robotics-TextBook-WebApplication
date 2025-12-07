import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import React, { useEffect } from 'react';
import gsap from 'gsap';

const FeatureList = [
  {
    title: 'Embodied Intelligence',
    imgSrc: require('@site/static/img/feature_robot_learning.png').default,
    description: (
      <>
        Explore how robots perceive, act, and learn from physical interactions.
        Dive deep into reinforcement learning, control theory, and sensor fusion
        for autonomous systems.
      </>
    ),
  },
  {
    title: 'Cognitive Computing',
    imgSrc: require('@site/static/img/feature_neural_brain.png').default,
    description: (
      <>
        Understand the "Brain" behind the bot. From pure logic to LLM-driven
        reasoning, learn how to build architectures that can plan, reason, and
        adapt to the unknown.
      </>
    ),
  },
  {
    title: 'Collaborative Future',
    imgSrc: require('@site/static/img/feature_human_robot.png').default,
    description: (
      <>
        The future is shared. Design systems for safe, efficient, and natural
        Human-Robot Interaction (HRI) that empowers humanity rather than replacing it.
      </>
    ),
  },
];

function Feature({ imgSrc, title, description, idx }) {
  return (
    <div className={clsx('col col--4 feature-col', styles.featureCol)}>
      <div className="text--center">
        <img src={imgSrc} className={styles.featureImg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDesc}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  useEffect(() => {
    gsap.fromTo('.feature-col',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.features',
          start: 'top 80%'
        }
      }
    );
  }, []);

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
