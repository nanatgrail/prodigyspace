import Link from "next/link"
import { GraduationCap, Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">prodigyspace</span>
            </div>
            <p className="text-sm text-muted-foreground">Your all-in-one productivity companion for student life.</p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/expenses" className="hover:text-foreground transition-colors">
                  Expense Tracker
                </Link>
              </li>
              <li>
                <Link href="/todos" className="hover:text-foreground transition-colors">
                  Task Manager
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-foreground transition-colors">
                  Sticky Notes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="flex space-x-3">
              <Link href="https://github.com/1046prt/" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://x.com/1046prt/" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="mailto:1046prt@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 prodigyspace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
