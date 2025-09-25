"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <div className={styles.iconContainer}>
              <span className="text-4xl">🤔</span>
            </div>
            <CardTitle className={styles.title}>
              Page Not Found
            </CardTitle>
            <CardDescription className={styles.description}>
              Sorry, we couldn't find the page you're looking for. It might have
              been moved or doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.buttonGrid}>
              <Link href="/" className={styles.homeButton}>
                <Button className={styles.button} variant="default">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/expenses" className={styles.browseButton}>
                <Button className={styles.button} variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Features
                </Button>
              </Link>
              <Button
                className={styles.backButton}
                variant="ghost"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}