import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Mail, Phone, MapPin } from "lucide-react";
import styles from "@styles/footer.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand - Left Side */}
          <div className={styles["brand-section"]}>
            <div className={styles["logo-container"]}>
              <div className={styles.logo}>
                <Image
                  src="/logo.png"
                  alt="ProdigySpace Logo"
                  width={24}
                  height={24}
                  className={styles.logo}
                />
              </div>
              <span className={styles["brand-name"]}>prodigyspace</span>
            </div>
            <p className={styles.description}>
              Your all-in-one productivity companion for student life. Stay
              organized, focused, and motivated.
            </p>
          </div>

          {/* Quick Links - Center */}
          <div className={styles["links-section"]}>
            <h3>Quick Links</h3>
            <ul className={styles["links-list"]}>
              <li>
                <Link href="/" className={styles.link}>Home</Link>
              </li>
              <li>
                <Link href="/expenses" className={styles.link}>Expense Tracker</Link>
              </li>
              <li>
                <Link href="/todos" className={styles.link}>Task Manager</Link>
              </li>
              <li>
                <Link href="/notes" className={styles.link}>Sticky Notes</Link>
              </li>
              <li>
                <Link href="/tasks" className={styles.link}>Study Planner</Link>
              </li>
              <li>
                <Link href="/wellbeing" className={styles.link}>Wellbeing Tracker</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social - Right Side */}
          <div className={styles["contact-section"]}>
            <h3>Contact Us</h3>
            <ul className={styles["contact-list"]}>
              <li className={styles["contact-item"]}>
                <Mail className={styles["contact-icon"]} />
                <span>1046prt@gmail.com</span>
              </li>
              <li className={styles["contact-item"]}>
                <Phone className={styles["contact-icon"]} />
                <span>+91-9508015377</span>
              </li>
              <li className={styles["contact-item"]}>
                <MapPin className={styles["contact-icon"]} />
                <span>Student Life Building, University Ave</span>
              </li>
            </ul>
            <div>
              <h3>Follow Us</h3>
              <div className={styles["social-links"]}>
                <Link href="https://github.com/1046prt/" className={styles["social-link"]}>
                  <Github />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link href="https://x.com/1046prt/" className={styles["social-link"]}>
                  <Twitter />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="mailto:1046prt@gmail.com" className={styles["social-link"]}>
                  <Mail />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>&copy; 2025 prodigyspace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}