import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Target, Users, Zap } from "lucide-react";
import styles from "../../styles/about.css";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Student-Focused",
      description:
        "Every feature is designed with student needs in mind, from budget tracking to assignment management.",
    },
    {
      icon: Zap,
      title: "Offline-First",
      description:
        "Work anywhere, anytime. All your data is stored locally and syncs when you're back online.",
    },
    {
      icon: Users,
      title: "Privacy-Focused",
      description:
        "Your personal data stays on your device. We don't track, store, or sell your information.",
    },
    {
      icon: GraduationCap,
      title: "Academic Success",
      description:
        "Tools and features specifically crafted to help you succeed in your academic journey.",
    },
  ];

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>About ProdigySpace</h1>
          <p className={styles.heroSubtitle}>
            ProdigySpace was created by students, for students. We understand
            the unique challenges of managing academic life, personal finances,
            and staying organized while pursuing your education.
          </p>
        </div>

        {/* Mission Section */}
        <div className={styles.missionSection}>
          <Card className={styles.missionCard}>
            <CardHeader className={styles.missionCardHeader}>
              <CardTitle className={styles.missionCardTitle}>
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.missionCardContent}>
              <p className={styles.missionDescription}>
                To empower students with simple, powerful tools that help them
                stay organized, manage their finances, and focus on what matters
                most - their education and personal growth. We believe that
                productivity tools should be accessible, intuitive, and work
                offline so you can stay productive anywhere.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className={styles.valuesSection}>
          <h2 className={styles.valuesTitle}>What We Stand For</h2>
          <div className={`${styles.valuesGrid} ${styles.twoColumns}`}>
            {values.map((value, index) => (
              <Card key={index} className={styles.valueCard}>
                <CardHeader className={styles.valueCardHeader}>
                  <div className={styles.valueIconContainer}>
                    <div
                      className={`${styles.valueIconWrapper} ${styles.light} ${styles.dark}`}
                    >
                      <value.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className={styles.valueCardTitle}>
                      {value.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className={styles.valueCardContent}>
                  <CardDescription
                    className={`${styles.valueDescription} ${styles.dark}`}
                  >
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className={styles.featuresSection}>
          <h2 className={styles.featuresTitle}>Why Choose prodigyspace?</h2>
          <div className={`${styles.featuresGrid} ${styles.threeColumns}`}>
            <div className={styles.featureItem}>
              <div
                className={`${styles.featureIconWrapper} ${styles.emerald} ${styles.dark}`}
              >
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  💰
                </span>
              </div>
              <h3 className={styles.featureTitle}>Smart Budgeting</h3>
              <p className={`${styles.featureDescription} ${styles.dark}`}>
                Track expenses with categories, set budgets, and visualize your
                spending patterns with intuitive charts.
              </p>
            </div>
            <div className={styles.featureItem}>
              <div
                className={`${styles.featureIconWrapper} ${styles.blue} ${styles.dark}`}
              >
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ✅
                </span>
              </div>
              <h3 className={styles.featureTitle}>Task Management</h3>
              <p className={`${styles.featureDescription} ${styles.dark}`}>
                Organize assignments, set priorities, and never miss a deadline
                with our comprehensive task system.
              </p>
            </div>
            <div className={styles.featureItem}>
              <div
                className={`${styles.featureIconWrapper} ${styles.amber} ${styles.dark}`}
              >
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  📝
                </span>
              </div>
              <h3 className={styles.featureTitle}>Quick Notes</h3>
              <p className={`${styles.featureDescription} ${styles.dark}`}>
                Capture ideas instantly with sticky notes that you can organize,
                color-code, and access offline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
