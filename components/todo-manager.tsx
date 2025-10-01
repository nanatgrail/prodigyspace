"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTodos } from "@/hooks/use-todos";
import type { TodoCategory, TodoPriority } from "@/types/todo";
import {
  Plus,
  CheckSquare,
  Clock,
  AlertTriangle,
  Calendar,
  Trash2,
  Download,
} from "lucide-react";
import { exportToCSV } from "@/lib/csv-export";

const categoryLabels: Record<TodoCategory, string> = {
  study: "Study",
  personal: "Personal",
  assignments: "Assignments",
  projects: "Projects",
  other: "Other",
};

const priorityLabels: Record<TodoPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityColors: Record<TodoPriority, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export function TodoManager() {
  const {
    todos,
    loading,
    addTodo,
    deleteTodo,
    toggleTodo,
    getTodoStats,
    getOverdueTodos,
    getTodayTodos,
  } = useTodos();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    category: "" as TodoCategory,
    priority: "medium" as TodoPriority,
    dueDate: "",
  });

  const stats = getTodoStats();
  const overdueTodos = getOverdueTodos();
  const todayTodos = getTodayTodos();

  const handleAddTodo = () => {
    if (!newTodo.title || !newTodo.category) return;

    addTodo({
      title: newTodo.title,
      description: newTodo.description || undefined,
      category: newTodo.category,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate || undefined,
      completed: false,
    });

    setNewTodo({
      title: "",
      description: "",
      category: "" as TodoCategory,
      priority: "medium",
      dueDate: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleExportCSV = () => {
    const exportData = todos.map((todo) => ({
      Title: todo.title,
      Description: todo.description || "",
      Category: categoryLabels[todo.category],
      Priority: priorityLabels[todo.priority],
      "Due Date": todo.dueDate || "",
      Completed: todo.completed ? "Yes" : "No",
      "Created At": new Date(todo.createdAt).toLocaleDateString(),
    }));
    exportToCSV(exportData, `todos_${new Date().toISOString().split("T")[0]}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return dueDate < today;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Todo Manager</h2>
          <p className="text-muted-foreground">
            Organize your tasks and stay productive
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task to stay organized
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="What needs to be done?"
                    value={newTodo.title}
                    onChange={(e) =>
                      setNewTodo((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add more details..."
                    value={newTodo.description}
                    onChange={(e) =>
                      setNewTodo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTodo.category}
                      onValueChange={(value: TodoCategory) =>
                        setNewTodo((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTodo.priority}
                      onValueChange={(value: TodoPriority) =>
                        setNewTodo((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(priorityLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) =>
                      setNewTodo((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <Button onClick={handleAddTodo} className="w-full">
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.overdue}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">To be completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>Manage all your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {todos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks yet. Add your first task to get started!
                </div>
              ) : (
                <div className="space-y-2">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg ${
                        todo.completed ? "bg-muted/50" : ""
                      }`}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium ${
                            todo.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {todo.title}
                        </div>
                        {todo.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {todo.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[todo.category]}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              priorityColors[todo.priority]
                            }`}
                          >
                            {priorityLabels[todo.priority]}
                          </Badge>
                          {todo.dueDate && (
                            <Badge
                              variant={
                                isOverdue(todo.dueDate) && !todo.completed
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {formatDate(todo.dueDate)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Tasks</CardTitle>
              <CardDescription>Focus on what&apos;s due today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayTodos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks due today. Great job staying on top of things!
                </div>
              ) : (
                <div className="space-y-2">
                  {todayTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg ${
                        todo.completed ? "bg-muted/50" : ""
                      }`}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium ${
                            todo.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {todo.title}
                        </div>
                        {todo.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {todo.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[todo.category]}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              priorityColors[todo.priority]
                            }`}
                          >
                            {priorityLabels[todo.priority]}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Tasks</CardTitle>
              <CardDescription>
                Tasks that need immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overdueTodos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No overdue tasks. You&apos;re doing great!
                </div>
              ) : (
                <div className="space-y-2">
                  {overdueTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 p-3 border border-destructive/20 rounded-lg bg-destructive/5"
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{todo.title}</div>
                        {todo.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {todo.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[todo.category]}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              priorityColors[todo.priority]
                            }`}
                          >
                            {priorityLabels[todo.priority]}
                          </Badge>
                          <Badge variant="destructive" className="text-xs">
                            Due {formatDate(todo.dueDate!)}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
              <CardDescription>Tasks you&apos;ve finished</CardDescription>
            </CardHeader>
            <CardContent>
              {todos.filter((todo) => todo.completed).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No completed tasks yet. Start checking off some tasks!
                </div>
              ) : (
                <div className="space-y-2">
                  {todos
                    .filter((todo) => todo.completed)
                    .map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
                      >
                        <Checkbox
                          checked={true}
                          onCheckedChange={() => toggleTodo(todo.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium line-through text-muted-foreground">
                            {todo.title}
                          </div>
                          {todo.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {todo.description}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {categoryLabels[todo.category]}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                priorityColors[todo.priority]
                              }`}
                            >
                              {priorityLabels[todo.priority]}
                            </Badge>
                            {todo.dueDate && (
                              <Badge variant="secondary" className="text-xs">
                                {formatDate(todo.dueDate)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
