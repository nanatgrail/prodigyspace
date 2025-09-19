"use client"

import { useState, useEffect } from "react"
import type { StudyGroup, Project, ChatMessage, MeetingSchedule } from "@/types/collaboration"

export function useCollaboration() {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [meetings, setMeetings] = useState<MeetingSchedule[]>([])

  useEffect(() => {
    const savedGroups = localStorage.getItem("studysync-study-groups")
    const savedProjects = localStorage.getItem("studysync-projects")
    const savedMessages = localStorage.getItem("studysync-messages")
    const savedMeetings = localStorage.getItem("studysync-meetings")

    if (savedGroups) {
      setStudyGroups(
        JSON.parse(savedGroups).map((group: any) => ({
          ...group,
          createdAt: new Date(group.createdAt),
          members: group.members.map((member: any) => ({
            ...member,
            joinedAt: new Date(member.joinedAt),
          })),
        })),
      )
    }

    if (savedProjects) {
      setProjects(
        JSON.parse(savedProjects).map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          dueDate: new Date(project.dueDate),
          tasks: project.tasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          })),
          files: project.files.map((file: any) => ({
            ...file,
            uploadedAt: new Date(file.uploadedAt),
          })),
        })),
      )
    }

    if (savedMessages) {
      setMessages(
        JSON.parse(savedMessages).map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        })),
      )
    }

    if (savedMeetings) {
      setMeetings(
        JSON.parse(savedMeetings).map((meeting: any) => ({
          ...meeting,
          date: new Date(meeting.date),
          recurring: meeting.recurring
            ? {
                ...meeting.recurring,
                endDate: meeting.recurring.endDate ? new Date(meeting.recurring.endDate) : undefined,
              }
            : undefined,
        })),
      )
    }
  }, [])

  const saveGroups = (newGroups: StudyGroup[]) => {
    setStudyGroups(newGroups)
    localStorage.setItem("studysync-study-groups", JSON.stringify(newGroups))
  }

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects)
    localStorage.setItem("studysync-projects", JSON.stringify(newProjects))
  }

  const saveMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages)
    localStorage.setItem("studysync-messages", JSON.stringify(newMessages))
  }

  const saveMeetings = (newMeetings: MeetingSchedule[]) => {
    setMeetings(newMeetings)
    localStorage.setItem("studysync-meetings", JSON.stringify(newMeetings))
  }

  const createStudyGroup = (groupData: Omit<StudyGroup, "id" | "createdAt" | "members">) => {
    const newGroup: StudyGroup = {
      ...groupData,
      id: Date.now().toString(),
      createdAt: new Date(),
      members: [
        {
          id: "current-user",
          name: "You",
          email: "you@example.com",
          role: "admin",
          joinedAt: new Date(),
          isOnline: true,
        },
      ],
    }
    saveGroups([...studyGroups, newGroup])
    return newGroup
  }

  const createProject = (projectData: Omit<Project, "id" | "createdAt" | "tasks" | "files">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      tasks: [],
      files: [],
    }
    saveProjects([...projects, newProject])
    return newProject
  }

  const addMessage = (messageData: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    saveMessages([...messages, newMessage])
  }

  const scheduleMeeting = (meetingData: Omit<MeetingSchedule, "id">) => {
    const newMeeting: MeetingSchedule = {
      ...meetingData,
      id: Date.now().toString(),
    }
    saveMeetings([...meetings, newMeeting])
    return newMeeting
  }

  return {
    studyGroups,
    projects,
    messages,
    meetings,
    createStudyGroup,
    createProject,
    addMessage,
    scheduleMeeting,
  }
}
