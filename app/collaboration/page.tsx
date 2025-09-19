"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudyGroupManager } from "@/components/study-group-manager"
import { ProjectCollaboration } from "@/components/project-collaboration"
import { useCollaboration } from "@/hooks/use-collaboration"
import { Users, FolderOpen, Calendar, MessageSquare } from "lucide-react"

export default function CollaborationPage() {
  const { studyGroups, projects, createStudyGroup, createProject } = useCollaboration()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Collaboration Hub</h1>
        <p className="text-muted-foreground">
          Connect with peers, manage group projects, and coordinate study sessions.
        </p>
      </div>

      <Tabs defaultValue="groups" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Groups ({studyGroups.length})
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Projects ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <StudyGroupManager
            studyGroups={studyGroups}
            onCreateGroup={createStudyGroup}
            onSelectGroup={(group) => console.log("Selected group:", group)}
          />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectCollaboration projects={projects} studyGroups={studyGroups} onCreateProject={createProject} />
        </TabsContent>

        <TabsContent value="meetings">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Meeting Scheduler</h3>
            <p className="text-muted-foreground">Schedule and manage study sessions with your groups.</p>
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Group Chat</h3>
            <p className="text-muted-foreground">Real-time messaging with your study groups.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
