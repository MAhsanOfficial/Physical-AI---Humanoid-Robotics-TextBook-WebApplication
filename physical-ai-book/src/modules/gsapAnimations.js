import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import gsap from 'gsap';

export default (function () {
    if (!ExecutionEnvironment.canUseDOM) {
        return null;
    }

    return {
        onRouteUpdate({ location }) {
            // VIP Book Page Turn Effect
            // We simulate a page opening from the left spine
            const mainContent = document.querySelector('main');
            const article = document.querySelector('article');
            const sidebar = document.querySelector('.theme-doc-sidebar-container');

            // Allow CSS 3D perspective to be applied globally
            gsap.set('body', { perspective: 2000 });

            if (mainContent || article) {
                const target = article || mainContent;

                // Prepare initial state - like a page about to turn onto the screen
                gsap.set(target, {
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    opacity: 0
                });

                // Clear previous animations to avoid conflicts
                gsap.killTweensOf([target, 'h1, h2, h3, p, li', sidebar]);

                const timeline = gsap.timeline();

                // 1. Sidebar Slide (if exists) - seamless entry
                if (sidebar) {
                    gsap.fromTo(sidebar,
                        { x: -30, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
                    );
                }

                // 2. The Main Page Turn - "Realistic 3D Flip"
                // Simulate the page being flat against the screen after flipping from the left
                timeline.fromTo(target,
                    {
                        rotationY: -15, // Start slightly folded
                        transformOrigin: "0% 50%", // Hinge on the left "spine"
                        rotationX: 2, // Slight organic tilt
                        z: -100, // Start slightly deeper in Z space
                        opacity: 0,
                    },
                    {
                        rotationY: 0, // Flatten out
                        rotationX: 0,
                        z: 0, // Bring to surface
                        opacity: 1,
                        duration: 1.0, // Slow, deliberate turn
                        ease: "power2.out", // Natural friction easing
                        clearProps: 'transform' // Essential for interactivity after anim
                    }
                );

                // 3. Staggered Content Reveal - VIP Flow
                // Animate Headings, Paragraphs, and Lists sequentially
                // Using 'article *' would be too much, so we target direct children or common blocks
                const contentSelector = article ? 'article h1, article h2, article h3, article p' : 'main h1, main h2, main p';

                timeline.from(contentSelector, {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.05, // Rapid but noticeable stagger
                    ease: 'back.out(1.2)', // Subtle overshoot for liveliness
                }, "-=0.6"); // Overlap with page turn
            }
        },
    };
})();

// Global interactive animations
if (ExecutionEnvironment.canUseDOM) {
    setTimeout(() => {
        // Initial Load Animation - "Opening the Book"
        const mainContent = document.querySelector('main');
        if (mainContent) {
            gsap.fromTo(
                mainContent,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.98
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2, // Luxurious slow duration
                    ease: 'power4.out', // Very smooth finish
                    delay: 0.1
                }
            );
        }

        // Navbar slide in - Fixed to ensure it stays visible
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            gsap.fromTo(navbar,
                { yPercent: -100, opacity: 0 },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    delay: 0.2,
                    clearProps: 'transform' // Ensure it doesn't get stuck with a transform
                }
            );
        }

        // Add hover effects for navbar items
        gsap.utils.toArray('.navbar__item.navbar__link').forEach(link => {
            gsap.to(link, {
                '--hover-progress': 0, // Custom property for hover state
                duration: 0.3,
                paused: true,
                ease: 'power1.inOut',
                overwrite: true
            });
            link.addEventListener('mouseenter', () => gsap.to(link, { '--hover-progress': 1, scale: 1.05 }));
            link.addEventListener('mouseleave', () => gsap.to(link, { '--hover-progress': 0, scale: 1 }));
        });

        // Add click listeners for that "Professional" feeling
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, .button');
            if (target) {
                gsap.to(target, {
                    scale: 0.96,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            }
        });

    }, 100);
}
