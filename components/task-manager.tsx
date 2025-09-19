"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Plus, CalendarIcon, Clock, Flag, Edit, Trash2, CheckCircle2 } from "lucide-react"
import type { Task } from "@/types/tasks"

interface TaskManagerProps {
  tasks: Task[]
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "subtasks" | "reminders">) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200",
}

const statusColors = {
  todo: "bg-gray-100 text-gray-800 border-gray-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

export function TaskManager({ tasks, onAddTask, onUpdateTask, onDeleteTask }: TaskManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dueDate")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Task["category"]>("assignment")
  const [priority, setPriority] = useState<Task["priority"]>("medium")
  const [dueDate, setDueDate] = useState<Date>()
  const [estimatedTime, setEstimatedTime] = useState("")
  const [course, setCourse] = useState("")
  const [professor, setProfessor] = useState("")

  const handleCreateTask = () => {
    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: "todo",
      dueDate,
      estimatedTime: estimatedTime ? Number.parseInt(estimatedTime) : undefined,
      tags: [],
      course: course.trim() || undefined,
      professor: professor.trim() || undefined,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setCategory("assignment")
    setPriority("medium")
    setDueDate(undefined)
    setEstimatedTime("")
    setCourse("")
    setProfessor("")
    setShowCreateDialog(false)
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (filterStatus !== "all" && task.status !== filterStatus) return false
      if (filterCategory !== "all" && task.category !== filterCategory) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.getTime() - b.dueDate.getTime()
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Task Manager</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={category} onValueChange={(value: Task["category"]) => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={priority} onValueChange={(value: Task["priority"]) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Estimated Time (minutes)</label>
                <Input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="60"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Course</label>
                <Input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g., CS 101" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Professor</label>
                <Input value={professor} onChange={(e) => setProfessor(e.target.value)} placeholder="Professor name" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask} disabled={!title.trim()}>
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="assignment">Assignment</SelectItem>
            <SelectItem value="study">Study</SelectItem>
            <SelectItem value="exam">Exam</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="reading">Reading</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="created">Created Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {tasks.length === 0 ? "Create your first task to get started!" : "Try adjusting your filters."}
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const daysUntilDue = task.dueDate ? getDaysUntilDue(task.dueDate) : null

            return (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={(checked) => onUpdateTask(task.id, { status: checked ? "completed" : "todo" })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <CardTitle className={`text-lg ${task.status === "completed" ? "line-through" : ""}`}>
                          {task.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className={priorityColors[task.priority]}>
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className={statusColors[task.status]}>
                            {task.status}
                          </Badge>
                          <Badge variant="outline">{task.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteTask(task.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                  )}

                  <div className="space-y-2 text-sm">
                    {task.course && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Course:</span>
                        <span>{task.course}</span>
                      </div>
                    )}

                    {task.dueDate && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-3 w-3" />
                        <span
                          className={
                            daysUntilDue !== null && daysUntilDue < 0
                              ? "text-red-600"
                              : daysUntilDue !== null && daysUntilDue < 3
                                ? "text-yellow-600"
                                : ""
                          }
                        >
                          {daysUntilDue !== null && daysUntilDue < 0
                            ? `${Math.abs(daysUntilDue)} days overdue`
                            : daysUntilDue === 0
                              ? "Due today"
                              : daysUntilDue === 1
                                ? "Due tomorrow"
                                : `Due in ${daysUntilDue} days`}
                        </span>
                      </div>
                    )}

                    {task.estimatedTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{task.estimatedTime} minutes</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
