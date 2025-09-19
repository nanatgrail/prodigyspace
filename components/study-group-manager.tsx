"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Plus, Calendar, MessageCircle, Settings } from "lucide-react"
import type { StudyGroup } from "@/types/collaboration"

interface StudyGroupManagerProps {
  studyGroups: StudyGroup[]
  onCreateGroup: (groupData: Omit<StudyGroup, "id" | "createdAt" | "members">) => void
  onSelectGroup: (group: StudyGroup) => void
}

export function StudyGroupManager({ studyGroups, onCreateGroup, onSelectGroup }: StudyGroupManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [groupSubject, setGroupSubject] = useState("")

  const handleCreateGroup = () => {
    if (!groupName.trim() || !groupSubject.trim()) return

    onCreateGroup({
      name: groupName.trim(),
      description: groupDescription.trim(),
      subject: groupSubject.trim(),
      isActive: true,
    })

    setGroupName("")
    setGroupDescription("")
    setGroupSubject("")
    setShowCreateDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Study Groups</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Group Name</label>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  value={groupSubject}
                  onChange={(e) => setGroupSubject(e.target.value)}
                  placeholder="e.g., Mathematics, Computer Science..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Describe the group's purpose..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup} disabled={!groupName.trim() || !groupSubject.trim()}>
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {studyGroups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No study groups yet</h3>
            <p className="text-muted-foreground mb-4">Create your first study group to start collaborating!</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {group.subject}
                    </Badge>
                  </div>
                  <Badge variant={group.isActive ? "default" : "secondary"}>
                    {group.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {group.description || "No description"}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 3).map((member) => (
                      <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onSelectGroup(group)} className="flex-1">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onSelectGroup(group)}>
                    <Calendar className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onSelectGroup(group)}>
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
