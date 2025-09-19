"use client"

import { useState, useEffect } from "react"
import type { Note, ScanDocument } from "@/types/notes"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [scannedDocs, setScannedDocs] = useState<ScanDocument[]>([])

  useEffect(() => {
    const savedNotes = localStorage.getItem("studysync-notes")
    const savedDocs = localStorage.getItem("studysync-scanned-docs")

    if (savedNotes) {
      setNotes(
        JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        })),
      )
    }

    if (savedDocs) {
      setScannedDocs(
        JSON.parse(savedDocs).map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
        })),
      )
    }
  }, [])

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes)
    localStorage.setItem("studysync-notes", JSON.stringify(newNotes))
  }

  const saveDocs = (newDocs: ScanDocument[]) => {
    setScannedDocs(newDocs)
    localStorage.setItem("studysync-scanned-docs", JSON.stringify(newDocs))
  }

  const addNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    saveNotes([...notes, newNote])
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note))
    saveNotes(updatedNotes)
  }

  const deleteNote = (id: string) => {
    saveNotes(notes.filter((note) => note.id !== id))
  }

  const addScannedDoc = (docData: Omit<ScanDocument, "id" | "createdAt">) => {
    const newDoc: ScanDocument = {
      ...docData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    saveDocs([...scannedDocs, newDoc])
  }

  const deleteScannedDoc = (id: string) => {
    saveDocs(scannedDocs.filter((doc) => doc.id !== id))
  }

  return {
    notes,
    scannedDocs,
    addNote,
    updateNote,
    deleteNote,
    addScannedDoc,
    deleteScannedDoc,
  }
}
