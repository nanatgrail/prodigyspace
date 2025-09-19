"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useStickyNotes } from "@/hooks/use-sticky-notes"
import { StickyNote } from "@/components/sticky-note"
import type { NoteColor } from "@/types/note"
import { Plus, StickyNoteIcon, Palette, RotateCcw } from "lucide-react"

const colorOptions: { value: NoteColor; label: string; class: string }[] = [
  { value: "yellow", label: "Yellow", class: "bg-yellow-200" },
  { value: "blue", label: "Blue", class: "bg-blue-200" },
  { value: "green", label: "Green", class: "bg-green-200" },
  { value: "pink", label: "Pink", class: "bg-pink-200" },
  { value: "purple", label: "Purple", class: "bg-purple-200" },
  { value: "orange", label: "Orange", class: "bg-orange-200" },
]

export function StickyNotesBoard() {
  const { notes, loading, addNote, updateNote, deleteNote, moveNote, resizeNote, getNotesStats } = useStickyNotes()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<NoteColor>("yellow")

  const stats = getNotesStats()

  const handleAddNote = () => {
    // Find a good position for the new note
    const baseX = 50 + ((notes.length * 20) % 300)
    const baseY = 50 + ((notes.length * 20) % 200)

    addNote({
      title: "",
      content: "",
      color: selectedColor,
      position: { x: baseX, y: baseY },
      size: { width: 250, height: 200 },
    })
    setIsAddDialogOpen(false)
  }

  const resetLayout = () => {
    notes.forEach((note, index) => {
      const x = 50 + (index % 4) * 270
      const y = 50 + Math.floor(index / 4) * 220
      moveNote(note.id, { x, y })
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sticky Notes</h2>
          <p className="text-muted-foreground">Quick notes and reminders for your thoughts</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetLayout} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Layout
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sticky Note</DialogTitle>
                <DialogDescription>Choose a color for your new note</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Color</label>
                  <Select value={selectedColor} onValueChange={(value: NoteColor) => setSelectedColor(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.class} border`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddNote} className="w-full">
                  Create Note
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <StickyNoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Sticky notes created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Color Distribution</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {colorOptions.map((color) => {
                const count = stats.colorBreakdown[color.value]
                if (count === 0) return null
                return (
                  <Badge key={color.value} variant="outline" className="text-xs">
                    <div className={`w-2 h-2 rounded-full ${color.class} mr-1`} />
                    {count}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Board */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle>Notes Board</CardTitle>
          <CardDescription>
            Drag notes around to organize them. Click and drag from the corners to resize.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative p-6">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
              <StickyNoteIcon className="h-16 w-16 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No notes yet</h3>
              <p className="text-sm text-center max-w-sm">
                Create your first sticky note to start organizing your thoughts and reminders.
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full min-h-[500px]">
              {notes.map((note) => (
                <StickyNote
                  key={note.id}
                  note={note}
                  onUpdate={updateNote}
                  onDelete={deleteNote}
                  onMove={moveNote}
                  onResize={resizeNote}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Sticky Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">1</span>
              </div>
              <div>
                <h4 className="font-medium">Create & Edit</h4>
                <p className="text-muted-foreground">Add new notes and click the edit button to add content.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">2</span>
              </div>
              <div>
                <h4 className="font-medium">Drag & Drop</h4>
                <p className="text-muted-foreground">Click and drag notes to move them around the board.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">3</span>
              </div>
              <div>
                <h4 className="font-medium">Resize</h4>
                <p className="text-muted-foreground">Drag from the bottom-right corner to resize notes.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
