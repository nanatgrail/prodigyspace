"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NoteEditor } from "@/components/note-editor"
import { DocumentScanner } from "@/components/document-scanner"
import { useNotes } from "@/hooks/use-notes"
import { Plus, Search, Edit, Trash2, Pin, FileText, Camera } from "lucide-react"
import type { Note } from "@/types/notes"

export default function NotesPage() {
  const { notes, scannedDocs, addNote, updateNote, deleteNote, addScannedDoc, deleteScannedDoc } = useNotes()
  const [showEditor, setShowEditor] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = categoryFilter === "all" || note.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  const handleSaveNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData)
    } else {
      addNote(noteData)
    }
    setShowEditor(false)
    setEditingNote(undefined)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowEditor(true)
  }

  const handleCancelEdit = () => {
    setShowEditor(false)
    setEditingNote(undefined)
  }

  if (showEditor) {
    return (
      <div className="container mx-auto p-6">
        <NoteEditor note={editingNote} onSave={handleSaveNote} onCancel={handleCancelEdit} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notes & Documents</h1>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      <Tabs defaultValue="notes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes ({notes.length})
          </TabsTrigger>
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Scanner ({scannedDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="lecture">Lecture</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Create your first note to get started!"}
                </p>
                <Button onClick={() => setShowEditor(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {note.isPinned && <Pin className="h-4 w-4 text-yellow-600" />}
                        <span className="truncate">{note.title}</span>
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEditNote(note)} className="h-8 w-8 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNote(note.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {note.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{note.content || "No content"}</p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{note.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">Updated {note.updatedAt.toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scanner">
          <DocumentScanner onSave={addScannedDoc} scannedDocs={scannedDocs} onDelete={deleteScannedDoc} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
