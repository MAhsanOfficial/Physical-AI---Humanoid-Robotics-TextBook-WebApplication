import React, { useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';
import gsap from 'gsap';
import Link from '@docusaurus/Link';

export default function Footer() {
    const { siteConfig } = useDocusaurusContext();

    useEffect(() => {
        // Animate Footer Elements on Scroll
        gsap.fromTo(`.${styles.footerGrid} > div`,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: `.${styles.footer}`,
                    start: 'top 90%'
                }
            }
        );
    }, []);

    return (
        <footer className={styles.footer}>
            <div className={styles.bgGlow}></div>
            <div className={styles.footerGrid}>

                {/* Brand Column */}
                <div className={styles.brandCol}>
                    <img src="/img/book-logo.svg" alt="Logo" className={styles.footerLogo} />
                    <p className={styles.brandDesc}>
                        {siteConfig.tagline}
                    </p>
                    <div className={styles.socialLinks}>
                        <a href="https://github.com/MAhsanOfficial" className={styles.socialIcon} aria-label="GitHub">
                            <i className="fa-brands fa-github"></i> 🐙
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                            <i className="fa-brands fa-linkedin"></i> 💼
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="Twitter">
                            <i className="fa-brands fa-twitter"></i> 🐦
                        </a>
                    </div>
                </div>

                {/* Explore Column */}
                <div>
                    <h4 className={styles.linkTitle}>Explore</h4>
                    <ul className={styles.linkList}>
                        <li className={styles.linkItem}>
                            <Link to="/docs/intro" className={styles.footerLink}>Read Book</Link>
                        </li>
                        <li className={styles.linkItem}>
                            <Link to="/chat" className={styles.footerLink}>AI Assistant</Link>
                        </li>
                        <li className={styles.linkItem}>
                            <Link to="/" className={styles.footerLink}>Home</Link>
                        </li>
                    </ul>
                </div>

                {/* Learn Column */}
                <div>
                    <h4 className={styles.linkTitle}>Learn</h4>
                    <ul className={styles.linkList}>
                        <li className={styles.linkItem}>
                            <Link to="/docs/intro" className={styles.footerLink}>Introduction</Link>
                        </li>
                        <li className={styles.linkItem}>
                            <Link to="#" className={styles.footerLink}>Algorithms</Link>
                        </li>
                        <li className={styles.linkItem}>
                            <Link to="#" className={styles.footerLink}>Hardware</Link>
                        </li>
                    </ul>
                </div>

                {/* Newsletter/Action Column */}
                <div>
                    <h4 className={styles.linkTitle}>Join the Revolution</h4>
                    <p className={styles.brandDesc}>
                        Stay updated with the latest in Humanoid Robotics and Physical AI.
                    </p>
                    {/* Mock Newsletter Input */}
                    <div style={{ display: 'flex', marginTop: '1rem' }}>
                        <input
                            type="email"
                            placeholder="Enter email..."
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px 0 0 4px',
                                border: 'none',
                                outline: 'none',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                width: '100%'
                            }}
                        />
                        <button style={{
                            background: 'var(--ifm-color-primary)',
                            border: 'none',
                            borderRadius: '0 4px 4px 0',
                            padding: '0 12px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>Go</button>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={styles.copyright}>
                    © {new Date().getFullYear()} Muhammad Ahsan. All rights reserved.
                </div>
                <div className={styles.poweredBy}>
                    <span className={styles.bolt}>⚡</span> Powered by Physical AI
                </div>
            </div>
        </footer>
    );
}
