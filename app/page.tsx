
"use client"


import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addTask, deleteTask, editTask, setTasks, toggleTaskCompletion } from '@/lib/redux/todoSlice';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.todo.tasks);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTask, setEditingTask] = useState<{ id: string | null, text: string }>({ id: null, text: "" });

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      dispatch(setTasks(JSON.parse(storedTasks)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const newTaskItem = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
      };
      dispatch(addTask(newTaskItem));
      setNewTask("");
    }
  };

  const handleToggleTaskCompletion = (id: string) => {
    dispatch(toggleTaskCompletion(id));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  const startEditing = (id: string, text: string) => {
    setEditingTask({ id, text });
  };

  const saveEditedTask = () => {
    if (editingTask.id !== null) {
      dispatch(editTask({ id: editingTask.id, text: editingTask.text }));
      setEditingTask({ id: null, text: "" });
    }
  };

  const cancelEditing = () => {
    setEditingTask({ id: null, text: "" });
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
                handleAddTask();
              }
            }}
            className="flex-1 rounded-r-none"
          />
          <Button onClick={handleAddTask} className="rounded-l-none">
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
                  onCheckedChange={() => handleToggleTaskCompletion(task.id)}
                  className="mr-4"
                />
                {editingTask.id === task.id ? (
                  <Input
                    type="text"
                    value={editingTask.text}
                    onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
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
                {editingTask.id === task.id ? (
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
                      onClick={() => handleDeleteTask(task.id)}
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
