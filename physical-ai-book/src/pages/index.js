import React, { useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from '@site/src/pages/index.module.css';
import gsap from 'gsap';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    // GSAP Intro Animations
    gsap.fromTo(`.${styles.heroTitle}`,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo(`.${styles.heroSubtitle}`,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo(`.${styles.buttons}`,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.6 }
    );
    gsap.fromTo(`.${styles.heroImage}`,
      { x: 100, opacity: 0, rotationY: 15 },
      { x: 0, opacity: 1, rotationY: 0, duration: 1.2, ease: 'power2.out', delay: 0.4 }
    );
  }, []);

  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={styles.heroGrid}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>🚀 The Future of Robotics</div>
          <Heading as="h1" className={styles.heroTitle}>
            Master <span className={styles.activeText}>Physical AI</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            A comprehensive guide to Humanoid Robotics, Embodied Intelligence,
            and the algorithms that power the machines of tomorrow.
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              Muhammad Ahsan's Guide ⏱️
            </Link>
            <Link
              className="button button--secondary button--lg button--chat-ai"
              to="/chat">
              Chat with AI 🤖
            </Link>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <div className={styles.glassCard}>
            <img
              src="img/robotics-hero.png"
              alt="Futuresic Robot Reading Book"
              className={styles.heroImage}
            />
            <div className={styles.imageGlow}></div>
          </div>
        </div>
      </div>
      <div className={styles.bgGrid}></div>
    </header >
  );
}

import HomepageBenefits from '@site/src/components/HomepageBenefits';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="The definitive guide to Physical AI and Humanoid Robotics.">
      <HomepageHeader />
      <main>
        <HomepageBenefits />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
