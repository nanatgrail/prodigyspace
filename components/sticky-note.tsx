"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import type { StickyNote as StickyNoteType, NoteColor } from "@/types/note"
import { Trash2, Edit, GripVertical, Move } from "lucide-react"

interface StickyNoteProps {
  note: StickyNoteType
  onUpdate: (id: string, updates: Partial<StickyNoteType>) => void
  onDelete: (id: string) => void
  onMove: (id: string, position: { x: number; y: number }) => void
  onResize: (id: string, size: { width: number; height: number }) => void
}

const noteColorClasses: Record<NoteColor, string> = {
  yellow: "bg-yellow-200 border-yellow-300 text-yellow-900",
  blue: "bg-blue-200 border-blue-300 text-blue-900",
  green: "bg-green-200 border-green-300 text-green-900",
  pink: "bg-pink-200 border-pink-300 text-pink-900",
  purple: "bg-purple-200 border-purple-300 text-purple-900",
  orange: "bg-orange-200 border-orange-300 text-orange-900",
}

export function StickyNote({ note, onUpdate, onDelete, onMove, onResize }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const noteRef = useRef<HTMLDivElement>(null)

  const handleSave = () => {
    onUpdate(note.id, {
      title: editTitle,
      content: editContent,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(note.title)
    setEditContent(note.content)
    setIsEditing(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("drag-handle")) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - note.position.x,
        y: e.clientY - note.position.y,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: note.size.width,
      height: note.size.height,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragStart.x)
        const newY = Math.max(0, e.clientY - dragStart.y)
        onMove(note.id, { x: newX, y: newY })
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        const newWidth = Math.max(200, resizeStart.width + deltaX)
        const newHeight = Math.max(150, resizeStart.height + deltaY)
        onResize(note.id, { width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart, resizeStart, note.id, onMove, onResize])

  return (
    <Card
      ref={noteRef}
      className={`absolute cursor-move select-none shadow-lg ${noteColorClasses[note.color]} ${
        isDragging ? "z-50 rotate-2 scale-105" : "z-10"
      } transition-transform duration-200`}
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        minWidth: 200,
        minHeight: 150,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="p-3 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 drag-handle">
          <div className="flex items-center gap-1">
            <GripVertical className="h-4 w-4 opacity-50" />
            <Move className="h-3 w-3 opacity-50" />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(!isEditing)
              }}
              className="h-6 w-6 p-0 hover:bg-black/10"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(note.id)
              }}
              className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-2">
          {isEditing ? (
            <>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Note title..."
                className="text-sm font-medium bg-white/50 border-0 focus:bg-white/80"
                onClick={(e) => e.stopPropagation()}
              />
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Write your note here..."
                className="flex-1 text-sm bg-white/50 border-0 resize-none focus:bg-white/80"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSave()
                  }}
                  className="h-6 text-xs px-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancel()
                  }}
                  className="h-6 text-xs px-2"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="font-medium text-sm line-clamp-2">{note.title || "Untitled Note"}</div>
              <div className="flex-1 text-sm whitespace-pre-wrap overflow-hidden">
                {note.content || "Click edit to add content..."}
              </div>
            </>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-current" />
        </div>
      </div>
    </Card>
  )
}
