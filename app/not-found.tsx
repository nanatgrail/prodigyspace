"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🤔</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Link href="/" className="w-full">
                <Button className="w-full" variant="default">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/expenses" className="w-full">
                <Button className="w-full bg-transparent" variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Features
                </Button>
              </Link>
              <Button className="w-full" variant="ghost" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
