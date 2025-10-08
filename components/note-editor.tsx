"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Tag, Pin, PinOff } from "lucide-react"
import type { Note } from "@/types/notes"
import styles from "@/styles/note-editor.css"

interface NoteEditorProps {
  note?: Note
  onSave: (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [category, setCategory] = useState<Note["category"]>(note?.category || "personal")
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isPinned, setIsPinned] = useState(note?.isPinned || false)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = () => {
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      isPinned,
    })
  }

  return (
    <Card className={styles.noteEditorCard}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle>
          <span>{note ? "Edit Note" : "New Note"}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPinned(!isPinned)}
            className={isPinned ? styles.pinButtonPinned : styles.pinButtonUnpinned}
          >
            {isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.formGrid}>
          <div>
            <label className={styles.formLabel}>Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
            />
          </div>
          <div>
            <label className={styles.formLabel}>Category</label>
            <Select value={category} onValueChange={(value: Note["category"]) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lecture">Lecture</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className={styles.formLabel}>Content</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className={styles.textArea}
          />
        </div>

        <div>
          <label className={styles.formLabel}>Tags</label>
          <div className={styles.tagsContainer}>
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={styles.tagBadge}
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
          <div className={styles.tagInputContainer}>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              className={styles.tagInput}
            />
            <Button onClick={handleAddTag} variant="outline" size="sm">
              <Tag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}