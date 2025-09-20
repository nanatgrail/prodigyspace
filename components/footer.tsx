import Link from "next/link";
import {
  GraduationCap,
  Github,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand - Left Side */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <GraduationCap className="h-5 w-5 text-black" />
              </div>
              <span className="text-lg font-bold">prodigyspace</span>
            </div>
            <p className="text-sm text-gray-300">
              Your all-in-one productivity companion for student life. Stay
              organized, focused, and motivated.
            </p>
          </div>

          {/* Quick Links - Center */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/expenses"
                  className="hover:text-white transition-colors"
                >
                  Expense Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/todos"
                  className="hover:text-white transition-colors"
                >
                  Task Manager
                </Link>
              </li>
              <li>
                <Link
                  href="/notes"
                  className="hover:text-white transition-colors"
                >
                  Sticky Notes
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="hover:text-white transition-colors"
                >
                  Study Planner
                </Link>
              </li>
              <li>
                <Link
                  href="/wellbeing"
                  className="hover:text-white transition-colors"
                >
                  Wellbeing Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social - Right Side */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>1046prt@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+91-9508015377</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Student Life Building, University Ave</span>
              </li>
            </ul>
            <div className="pt-2">
              <h3 className="text-sm font-semibold">Follow Us</h3>
              <div className="flex space-x-4 pt-2">
                <Link
                  href="https://github.com/1046prt/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href="https://x.com/1046prt/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="mailto:1046prt@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; 2025 prodigyspace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
