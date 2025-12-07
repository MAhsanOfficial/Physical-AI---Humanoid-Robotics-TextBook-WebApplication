// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics by Muhammad Ahsan',
  tagline: 'Designing Embodied Intelligence for the Real World - A Book by Muhammad Ahsan',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://GIAIC.github.io',
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'GIAIC', // Usually your GitHub org/user name.
  projectName: 'physical-ai-humanoid-robotics-textbook', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
      },
    },
  },
  scripts: [
    {
      src: '/scripts/embed.js', // Path to your custom script
      async: true, // Load asynchronously
    },
  ],

  clientModules: [
    require.resolve('./src/modules/gsapAnimations.js'),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // editUrl removed to hide "Edit this page" links
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/responsive.css'],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Physical AI (Muhammad Ahsan)',
        logo: {
          alt: 'Physical AI Book Logo',
          src: 'img/book-logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'bookSidebar',
            position: 'left',
            label: 'Read Book',
          },
          { to: '/chat', label: 'AI Chat', position: 'left' },
          {
            to: '/login',
            label: 'Login',
            position: 'right',
            className: 'logged-out-only',
          },
          {
            to: '/signup',
            label: 'Sign Up',
            position: 'right',
            className: 'logged-out-only',
          },
          {
            to: '/logout',
            label: 'Logout',
            position: 'right',
            className: 'logged-in-only',
          },
          {
            type: 'custom-userBadge',
            position: 'right',
            className: 'logged-in-only',
          },
          {
            type: 'custom-languageToggle',
            position: 'right',
          },
          {
            href: 'https://github.com/MAhsanOfficial',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Book',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Created by Muhammad Ahsan',
                href: 'https://github.com/GIAIC', // Assuming GIAIC is associated with Muhammad Ahsan
              },
              {
                label: 'GitHub',
                href: 'https://github.com/MAhsanOfficial',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Muhammad Ahsan & Panaversity. Powered by Physical AI.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
