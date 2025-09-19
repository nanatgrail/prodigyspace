"use client";

import { useState, useEffect } from "react";
import type { Bookmark } from "@/types/utilities";
import { storage } from "@/lib/storage";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const saved = storage.getItem<Bookmark[]>("bookmarks") || [];
    setBookmarks(saved);
  }, []);

  const addBookmark = (title: string, url: string, category: string) => {
    const bookmark: Bookmark = {
      id: Date.now().toString(),
      title,
      url: url.startsWith("http") ? url : `https://${url}`,
      category,
      createdAt: new Date(),
    };
    const updated = [...bookmarks, bookmark];
    setBookmarks(updated);
    storage.setItem("bookmarks", updated);
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter((bookmark) => bookmark.id !== id);
    setBookmarks(updated);
    storage.setItem("bookmarks", updated);
  };

  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    const updated = bookmarks.map((bookmark) =>
      bookmark.id === id ? { ...bookmark, ...updates } : bookmark
    );
    setBookmarks(updated);
    storage.setItem("bookmarks", updated);
  };

  const getBookmarksByCategory = (category: string) => {
    return bookmarks.filter((bookmark) => bookmark.category === category);
  };

  const getCategories = () => {
    const categories = [
      ...new Set(bookmarks.map((bookmark) => bookmark.category)),
    ];
    return categories.sort();
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmark,
    getBookmarksByCategory,
    getCategories,
  };
}
