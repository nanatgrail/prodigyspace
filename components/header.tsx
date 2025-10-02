"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import styles from "@/styles/header.css";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/expenses", label: "Expenses" },
    { href: "/todos", label: "Tasks" },
    { href: "/notes", label: "Notes" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo and Title */}
        <Link href="/" className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <GraduationCap className={styles.menuButtonIcon} />
          </div>
          <span className={styles.logoText}>prodigyspace</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Theme Toggle */}
        <div className={styles.desktopThemeToggle}>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button and Theme Toggle */}
        <div className={styles.mobileControls}>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={styles.menuButton}
          >
            {isMenuOpen ? (
              <X className={styles.menuButtonIcon} />
            ) : (
              <Menu className={styles.menuButtonIcon} />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={styles.mobileNav}>
          <nav className={styles.mobileNavContainer}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
