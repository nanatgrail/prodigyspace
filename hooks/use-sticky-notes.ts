"use client"

import { useState, useEffect, useCallback } from "react"
import { storage } from "@/lib/storage"
import type { StickyNote, NoteColor, NotesStats } from "@/types/note"

const NOTES_KEY = "prodigyspace_sticky_notes"

export function useStickyNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [loading, setLoading] = useState(true)

  // Load data from storage on mount
  useEffect(() => {
    const loadData = () => {
      const savedNotes = storage.getItem<StickyNote[]>(NOTES_KEY) || []
      setNotes(savedNotes)
      setLoading(false)
    }

    loadData()
  }, [])

  // Save notes to storage whenever they change
  useEffect(() => {
    if (!loading) {
      storage.setItem(NOTES_KEY, notes)
    }
  }, [notes, loading])

  const addNote = useCallback((note: Omit<StickyNote, "id" | "createdAt" | "updatedAt">) => {
    const newNote: StickyNote = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setNotes((prev) => [...prev, newNote])
  }, [])

  const updateNote = useCallback((id: string, updates: Partial<StickyNote>) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note)))
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }, [])

  const moveNote = useCallback((id: string, position: { x: number; y: number }) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, position, updatedAt: Date.now() } : note)))
  }, [])

  const resizeNote = useCallback((id: string, size: { width: number; height: number }) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, size, updatedAt: Date.now() } : note)))
  }, [])

  const getNotesStats = useCallback((): NotesStats => {
    const total = notes.length

    const colorBreakdown: Record<NoteColor, number> = {
      yellow: 0,
      blue: 0,
      green: 0,
      pink: 0,
      purple: 0,
      orange: 0,
    }

    notes.forEach((note) => {
      colorBreakdown[note.color]++
    })

    return {
      total,
      colorBreakdown,
    }
  }, [notes])

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    moveNote,
    resizeNote,
    getNotesStats,
  }
}
