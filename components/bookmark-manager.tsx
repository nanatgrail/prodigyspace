"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bookmark, Plus, ExternalLink, Trash2, Edit } from "lucide-react"
import { useBookmarks } from "@/hooks/use-bookmarks"

export function BookmarkManager() {
  const { bookmarks, addBookmark, removeBookmark, updateBookmark, getBookmarksByCategory, getCategories } =
    useBookmarks()

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "Study",
  })

  const categories = ["Study", "Research", "Tools", "Entertainment", "Other"]
  const allCategories = getCategories()
  const displayedBookmarks = selectedCategory === "all" ? bookmarks : getBookmarksByCategory(selectedCategory)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.url) {
      if (editingId) {
        updateBookmark(editingId, formData)
        setEditingId(null)
      } else {
        addBookmark(formData.title, formData.url, formData.category)
      }
      setFormData({ title: "", url: "", category: "Study" })
      setShowAddForm(false)
    }
  }

  const handleEdit = (bookmark: any) => {
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      category: bookmark.category,
    })
    setEditingId(bookmark.id)
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setFormData({ title: "", url: "", category: "Study" })
    setEditingId(null)
    setShowAddForm(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-purple-500" />
          Bookmarks
        </CardTitle>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-muted rounded-lg">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter bookmark title"
                required
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
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
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Update" : "Add"} Bookmark</Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {allCategories.length > 0 && (
          <div>
            <Label>Filter by Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
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

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {displayedBookmarks.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">No bookmarks yet. Add your first bookmark!</div>
          ) : (
            displayedBookmarks.map((bookmark) => (
              <div key={bookmark.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{bookmark.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{bookmark.url}</div>
                  <div className="text-xs text-muted-foreground">{bookmark.category}</div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button variant="ghost" size="sm" onClick={() => window.open(bookmark.url, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(bookmark)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeBookmark(bookmark.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
