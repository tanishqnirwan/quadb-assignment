"use client"

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }
  }, []);

  const saveTasksToLocalStorage = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTaskItem: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
      };
      const updatedTasks = [...tasks, newTaskItem];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEditedTask = () => {
    if (editingId) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingId ? { ...task, text: editingText } : task
      );
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setEditingId(null);
      setEditingText("");
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-secondary text-secondary-foreground py-6 px-8">
        <h1 className="text-3xl font-bold">Todo List</h1>
      </header>
      <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
        <div className="mb-8 flex items-center">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
            className="flex-1 rounded-r-none"
          />
          <Button onClick={addTask} className="rounded-l-none">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between rounded-lg bg-card p-4 shadow ${
                task.completed ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-center flex-1">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mr-4"
                />
                {editingId === task.id ? (
                  <Input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveEditedTask();
                      } else if (e.key === "Escape") {
                        cancelEditing();
                      }
                    }}
                    className="flex-1"
                  />
                ) : (
                  <span
                    className={
                      task.completed ? "line-through text-muted-foreground" : ""
                    }
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {editingId === task.id ? (
                  <>
                    <Button variant="ghost" size="icon" onClick={saveEditedTask}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(task.id, task.text)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default TodoList;
