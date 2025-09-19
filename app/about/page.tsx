import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Target, Users, Zap } from "lucide-react";

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
    <div className="min-h-screen py-12">
      <div className="container px-4">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
            About ProdigySpace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            ProdigySpace was created by students, for students. We understand
            the unique challenges of managing academic life, personal finances,
            and staying organized while pursuing your education.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mx-auto max-w-3xl mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
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
        <div className="mx-auto max-w-5xl mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <value.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose prodigyspace?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  💰
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Budgeting
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track expenses with categories, set budgets, and visualize your
                spending patterns with intuitive charts.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ✅
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Task Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize assignments, set priorities, and never miss a deadline
                with our comprehensive task system.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  📝
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Quick Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
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
