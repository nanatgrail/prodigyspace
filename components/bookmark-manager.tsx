"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, Plus, ExternalLink, Trash2, Edit } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import styles from "@styles/bookmark-manager.css";

export function BookmarkManager() {
  const {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmark,
    getBookmarksByCategory,
    getCategories,
  } = useBookmarks();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "Study",
  });

  const categories = ["Study", "Research", "Tools", "Entertainment", "Other"];
  const allCategories = getCategories();
  const displayedBookmarks =
    selectedCategory === "all"
      ? bookmarks
      : getBookmarksByCategory(selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.url) {
      if (editingId) {
        updateBookmark(editingId, formData);
        setEditingId(null);
      } else {
        addBookmark(formData.title, formData.url, formData.category);
      }
      setFormData({ title: "", url: "", category: "Study" });
      setShowAddForm(false);
    }
  };

  const handleEdit = (bookmark: any) => {
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      category: bookmark.category,
    });
    setEditingId(bookmark.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData({ title: "", url: "", category: "Study" });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <Card className={styles.bookmarkManager}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.titleContainer}>
          <Bookmark className={`${styles.icon} text-purple-500`} />
          Bookmarks
        </CardTitle>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          className={styles.addButton}
        >
          <Plus className={styles.icon} />
        </Button>
      </CardHeader>
      <CardContent className={styles.content}>
        {showAddForm && (
          <form onSubmit={handleSubmit} className={styles.addForm}>
            <div className={styles.formGroup}>
              <Label htmlFor="title" className={styles.formLabel}>
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter bookmark title"
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="url" className={styles.formLabel}>
                URL
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://example.com"
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="category" className={styles.formLabel}>
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className={styles.formSelect}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={styles.buttonGroup}>
              <Button type="submit">
                {editingId ? "Update" : "Add"} Bookmark
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {allCategories.length > 0 && (
          <div className={styles.formGroup}>
            <Label className={styles.formLabel}>Filter by Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className={styles.formSelect}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className={styles.bookmarkListContainer}>
          {displayedBookmarks.length === 0 ? (
            <div className={styles.emptyState}>
              No bookmarks yet. Add your first bookmark!
            </div>
          ) : (
            displayedBookmarks.map((bookmark) => (
              <div key={bookmark.id} className={styles.bookmarkItem}>
                <div className={styles.bookmarkInfo}>
                  <div className={styles.bookmarkTitle}>{bookmark.title}</div>
                  <div className={styles.bookmarkUrl}>{bookmark.url}</div>
                  <div className={styles.bookmarkCategory}>
                    {bookmark.category}
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(bookmark.url, "_blank")}
                    className={styles.actionButton}
                  >
                    <ExternalLink className={styles.icon} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(bookmark)}
                    className={styles.actionButton}
                  >
                    <Edit className={styles.icon} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.id)}
                    className={styles.actionButton}
                  >
                    <Trash2 className={styles.icon} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
