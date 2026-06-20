import styles from "./Footer.module.css";

const quickLinks = [
  { label: "Search Professors", href: "/#search" },
  { label: "Universities", href: "/universities" },
  { label: "Write a Review", href: "/#" },
  { label: "About Us", href: "/about" },
];

const resources = [
  { label: "How It Works", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Contact Us", href: "#" },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/rateyourprofessor/",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.instagram.com/rateyourprofessor/",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBorder} />
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <a href="/" className={styles.logo}>
              <span className={styles.logoMark}>R</span>
              <span className={styles.logoText}>RateYourProfessor</span>
            </a>
            <p className={styles.tagline}>
              India&apos;s largest platform for honest, anonymous professor
              ratings from real students.
            </p>
            <div className={styles.socials}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.socialLink}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Platform</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Resources</h4>
            <ul className={styles.linkList}>
              {resources.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletter}>
            <h4 className={styles.colTitle}>Stay Updated</h4>
            <p className={styles.newsletterDesc}>
              Get notified about new professors and universities.
            </p>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.emailInput}
                readOnly
              />
              <button className={styles.subscribeBtn}>Subscribe</button>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} RateYourProfessor. Made with ❤️ for
            students.
          </p>
        </div>
        <div className={styles.bottom}>
          <p className={styles.disclaimer}>
            DISCLAIMER: RateYourProfessor is a platform that provides
            information based on user-submitted content. We do not guarantee the
            reliability or accuracy of the content within this site. Users are
            advised to use this information at their own risk. It is important
            to note that we are not responsible for user-submitted ratings,
            comments, or errors. We strive to maintain the integrity of our
            platform, but users should exercise discretion when relying on the
            information presented here.
          </p>
        </div>
      </div>
    </footer>
  );
}
