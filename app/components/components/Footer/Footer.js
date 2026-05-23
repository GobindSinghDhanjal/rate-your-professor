import styles from './Footer.module.css';

const quickLinks = [
  { label: 'Search Professors', href: '#search' },
  { label: 'Universities', href: '#universities' },
  { label: 'Write a Review', href: '#' },
  { label: 'About Us', href: '#' },
];

const resources = [
  { label: 'How It Works', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const socials = [
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
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
              India&apos;s largest platform for honest, anonymous professor ratings from real students.
            </p>
            <div className={styles.socials}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} className={styles.socialLink} aria-label={s.label}>
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
                  <a href={l.href} className={styles.link}>{l.label}</a>
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
                  <a href={l.href} className={styles.link}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletter}>
            <h4 className={styles.colTitle}>Stay Updated</h4>
            <p className={styles.newsletterDesc}>Get notified about new professors and universities.</p>
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
            © {new Date().getFullYear()} RateYourProfessor. Made with ❤️ for students across India.
          </p>
          <p className={styles.disclaimer}>
            All reviews are anonymous and from verified students only.
          </p>
        </div>
      </div>
    </footer>
  );
}
